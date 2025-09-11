/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import "./auth/index";
import "./user/index";
import "./project/index";
import "./actor/index";
import "./use-case/index";
import { INestApplication } from "@nestjs/common";
import { SwaggerModule } from "@nestjs/swagger";
import { generateOpenApiDocument } from "./generator";

export function setupSwagger(app: INestApplication) {
  const document = generateOpenApiDocument();

  SwaggerModule.setup("api", app, document as any, {
    swaggerOptions: {
      persistAuthorization: true,

      requestInterceptor: (req: any) => {
        try {
          req.credentials = "include";

          // always try to include any saved token (single header)
          const savedToken = (() => {
            try {
              return localStorage.getItem("my_swagger_token");
            } catch {
              return null;
            }
          })();

          if (savedToken) {
            try {
              // ensure single canonical header (case-insensitive)
              if (req && req.headers && typeof req.headers.get === "function") {
                try {
                  req.headers.delete("authorization");
                } catch {}
                try {
                  req.headers.delete("Authorization");
                } catch {}
                req.headers.set("Authorization", "Bearer " + String(savedToken));
              } else if (req && req.headers && typeof req.headers === "object") {
                try {
                  delete req.headers["authorization"];
                } catch {}
                try {
                  delete req.headers["Authorization"];
                } catch {}
                req.headers["authorization"] = "Bearer " + String(savedToken);
              } else {
                req.headers = { authorization: "Bearer " + String(savedToken) };
              }
            } catch {
              /* noop */
            }
          }
        } catch {
          /* noop */
        }
        return req;
      },

      responseInterceptor: (res: any) => {
        try {
          const headers = res.headers;

          // detect authorization header on responses
          const maybeAuthHeader =
            (headers &&
              typeof headers.get === "function" &&
              (headers.get("authorization") || headers.get("Authorization"))) ||
            (headers && (headers.authorization || headers.Authorization)) ||
            undefined;

          if (maybeAuthHeader) {
            const rawToken =
              typeof maybeAuthHeader === "string" && maybeAuthHeader.startsWith("Bearer ")
                ? maybeAuthHeader.slice(7)
                : String(maybeAuthHeader);

            try {
              localStorage.setItem("my_swagger_token", rawToken);
            } catch {
              // ignore storage failures
            }

            // update UI state so locks close
            try {
              const ui = (window as any).ui;
              if (ui?.authActions && typeof ui.authActions.authorize === "function") {
                ui.authActions.authorize({
                  bearerAuth: {
                    name: "bearerAuth",
                    schema: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
                    value: rawToken,
                  },
                });
              } else if (ui && typeof ui.preauthorizeApiKey === "function") {
                ui.preauthorizeApiKey("bearerAuth", rawToken);
              }
            } catch {
              // noop
            }
          } else {
            // No Authorization header in response — check for logout/unauthorized signals
            try {
              const status = res && (res.status ?? (res.response && res.response.status));
              const url =
                (res &&
                  (res.url ||
                    (res.request && res.request.url) ||
                    (res.response && res.response.url))) ||
                "";

              // Consider: explicit logout endpoints, 401, 204 (common for sign-out), or 205 Reset Content
              const looksLikeLogout =
                (typeof url === "string" &&
                  /\/?logout|signout|revoke|\/?auth\/logout/i.test(url)) ||
                status === 401 ||
                status === 204 ||
                status === 205;

              if (looksLikeLogout) {
                try {
                  localStorage.removeItem("my_swagger_token");
                } catch {}

                // Force Swagger UI logout (multiple fallbacks)
                try {
                  const ui = (window as any).ui;
                  if (ui?.authActions && typeof ui.authActions.logout === "function") {
                    ui.authActions.logout();
                  } else if (ui?.getSystem && ui.getSystem()?.authActions?.logout) {
                    ui.getSystem().authActions.logout();
                  } else if (ui?.authActions && typeof ui.authActions.authorize === "function") {
                    // fallback: authorize with empty value to clear
                    ui.authActions.authorize({
                      bearerAuth: {
                        name: "bearerAuth",
                        schema: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
                        value: "",
                      },
                    });
                  } else if (ui && typeof ui.preauthorizeApiKey === "function") {
                    ui.preauthorizeApiKey("bearerAuth", "");
                  }
                } catch {
                  // noop
                }
              }
            } catch {
              // noop
            }
          }
        } catch {
          /* noop */
        }
        return res;
      },
    },

    jsonDocumentUrl: "api/openapi.json",
    customSiteTitle: "API Documentation",

    // Inline JS that:
    //  - Rehydrates UI auth on mount,
    //  - Monkey-patches localStorage.setItem/removeItem/clear to keep UI in sync,
    //  - Listens to storage events for cross-tab changes.
    customJsStr: `
      (function () {
        const KEY = 'my_swagger_token';

        function tryAuthorizeRaw(raw) {
          try {
            if (!raw) return false;
            const ui = window.ui;
            if (ui?.authActions && typeof ui.authActions.authorize === 'function') {
              ui.authActions.authorize({
                bearerAuth: {
                  name: 'bearerAuth',
                  schema: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
                  value: raw,
                }
              });
              return true;
            } else if (ui && typeof ui.preauthorizeApiKey === 'function') {
              try {
                ui.preauthorizeApiKey('bearerAuth', raw);
                return true;
              } catch {}
            }
          } catch (e) {
            // swallow
          }
          return false;
        }

        function tryLogoutUI() {
          try {
            const ui = window.ui;
            if (ui?.authActions && typeof ui.authActions.logout === 'function') {
              ui.authActions.logout();
              return true;
            }
            if (ui?.getSystem && ui.getSystem()?.authActions?.logout) {
              ui.getSystem().authActions.logout();
              return true;
            }
            // fallback: authorize with empty value to clear state
            if (ui?.authActions && typeof ui.authActions.authorize === 'function') {
              ui.authActions.authorize({
                bearerAuth: {
                  name: 'bearerAuth',
                  schema: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
                  value: '',
                }
              });
              return true;
            }
            if (ui && typeof ui.preauthorizeApiKey === 'function') {
              try {
                ui.preauthorizeApiKey('bearerAuth', '');
                return true;
              } catch {}
            }
          } catch (e) {
            // swallow
          }
          return false;
        }

        // initial restore (poll until ui exists)
        (function initialRestore() {
          try {
            const raw = localStorage.getItem(KEY);
            if (!raw) return;
            let attempts = 0;
            const max = 60; // ~6s
            const interval = setInterval(() => {
              if (tryAuthorizeRaw(raw) || attempts++ >= max) {
                clearInterval(interval);
              }
            }, 100);
          } catch (e) {
            // ignore
          }
        })();

        // monkey-patch localStorage to react to token set/remove/clear in same tab
        try {
          const _setItem = localStorage.setItem.bind(localStorage);
          const _removeItem = localStorage.removeItem.bind(localStorage);
          const _clear = localStorage.clear.bind(localStorage);

          localStorage.setItem = function (k, v) {
            try {
              _setItem(k, v);
            } catch (e) {
              // still continue to try to update UI
            }
            if (k === KEY) {
              // small delay to let any calling flow finish
              setTimeout(() => {
                tryAuthorizeRaw(String(v));
              }, 0);
            }
          };

          localStorage.removeItem = function (k) {
            try {
              _removeItem(k);
            } catch (e) {
              // continue
            }
            if (k === KEY) {
              setTimeout(() => {
                tryLogoutUI();
              }, 0);
            }
          };

          localStorage.clear = function () {
            try {
              _clear();
            } catch (e) {}
            setTimeout(() => {
              tryLogoutUI();
            }, 0);
          };
        } catch (e) {
          // Some browsers/contexts may throw when patching localStorage — ignore in that case.
        }

        // listen for cross-tab changes
        try {
          window.addEventListener('storage', (e) => {
            try {
              if (!e) return;
              if (e.key !== KEY) return;
              if (e.newValue) {
                tryAuthorizeRaw(e.newValue);
              } else {
                tryLogoutUI();
              }
            } catch {}
          });
        } catch (e) {
          // ignore
        }
      })();
    `,
  });
}

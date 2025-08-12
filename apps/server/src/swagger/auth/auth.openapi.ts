import { registerMultiple, registry } from "../registry";
import {
  registerSchema,
  loginSchema,
  tokensSchema,
  refreshTokenCookieSchema,
} from "@repo/shared-schemas";

// Register DTOs
registerMultiple(registry, {
  RegisterDto: registerSchema,
  LoginDto: loginSchema,
  TokensDto: tokensSchema,
});
// /auth/register
registry.registerPath({
  method: "post",
  path: "/auth/register",
  tags: ["Auth"],

  request: {
    body: {
      description: "Register a new user",
      required: true,
      content: {
        "application/json": { schema: { $ref: "#/components/schemas/RegisterDto" } },
      },
    },
  },
  responses: {
    201: {
      description: "User registered successfully",
      content: {
        "application/json": { schema: { $ref: "#/components/schemas/TokensDto" } },
      },
    },
    400: {
      description: "Validation error",
    },
  },
});

// /auth/login
registry.registerPath({
  method: "post",
  path: "/auth/login",
  tags: ["Auth"],

  request: {
    body: {
      description: "Login using username or email and password",
      required: true,
      content: {
        "application/json": { schema: { $ref: "#/components/schemas/LoginDto" } },
      },
    },
  },
  responses: {
    200: {
      description: "Login successful",
      content: {
        "application/json": { schema: { $ref: "#/components/schemas/TokensDto" } },
      },
    },
    401: {
      description: "Invalid credentials",
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/refresh",
  tags: ["Auth"],
  request: {
    cookies: refreshTokenCookieSchema, // This should be a Zod schema object
  },
  responses: {
    200: {
      description: "Tokens refreshed successfully",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/TokensDto" },
        },
      },
    },
    401: {
      description: "Missing or invalid refresh token",
    },
  },
});

// /auth/logout
registry.registerPath({
  method: "post",
  path: "/auth/logout",
  tags: ["Auth"],

  responses: {
    200: {
      description: "User logged out successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
            },
          },
        },
      },
    },
  },
});

// /auth/logout-all
registry.registerPath({
  method: "post",
  path: "/auth/logout-all",
  tags: ["Auth"],

  responses: {
    200: {
      description: "User logged out from all sessions",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
            },
          },
        },
      },
    },
  },
});

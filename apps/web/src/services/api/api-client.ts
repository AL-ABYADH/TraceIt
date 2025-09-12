import { tokenService } from "@/modules/core/auth/services/token-service";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (!config.isPublic) {
      const token = tokenService.getToken();
      if (token) {
        config.headers = config.headers ?? {};
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (err) => Promise.reject(err),
);

apiClient.interceptors.response.use(
  (res) => {
    const authHeader = res.headers?.authorization ?? res.headers?.Authorization;
    if (authHeader) {
      const token =
        typeof authHeader === "string" ? authHeader.replace(/^Bearer\s+/i, "") : authHeader;
      tokenService.setToken(token);
    }
    return res;
  },
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      // backend couldn't auto-refresh or returned unauthorized; clear token & notify app
      tokenService.clear();
      tokenService.emitUnauthorized();
    }
    return Promise.reject(error);
  },
);

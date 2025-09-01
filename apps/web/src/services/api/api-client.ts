import axios from "axios";

export const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  // Example: attach token if present and config.isPublic is false
  // const token = getTokenFromCookieOrStorage();
  // if (token) config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
  return config;
});

apiClient.interceptors.response.use(
  (res) => {
    // small global response logging (no-op by default)
    return res;
  },
  async (error) => {
    // Re-throw so downstream code (http.ts) can map into ApiError
    return Promise.reject(error);
  },
);

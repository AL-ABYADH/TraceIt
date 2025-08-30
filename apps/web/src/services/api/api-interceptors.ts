import apiClient from "./api-client";

apiClient.interceptors.request.use((config) => {
  // Example: attach token if present and config.public is false
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

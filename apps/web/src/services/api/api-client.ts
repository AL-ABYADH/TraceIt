// REST API client setup
import axios from "axios";

if (typeof window === "undefined") {
  throw new Error("api-client: this module must only be imported from client-side code (browser).");
}

const apiClient = axios.create({
  baseURL: process.env.API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;

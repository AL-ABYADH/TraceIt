import { AxiosRequestConfig } from "axios";
import { ApiError } from "./api-errors";
import { Endpoint } from "@/types/endpoint-type";
import { apiClient } from "./api-client";

export type HttpOptions = {
  raw?: boolean; // if true, return the full AxiosResponse
  signal?: AbortSignal;
};

function mapAxiosError(err: unknown): never {
  if ((err as any)?.isAxiosError) {
    const a = err as any;
    const status = a.response?.status;
    const data = a.response?.data;
    const message = data?.message ?? a.message ?? "Request failed";
    throw new ApiError(message, status, data);
  }
  throw err as Error;
}

export async function request<T = any>(config: AxiosRequestConfig, opts?: HttpOptions) {
  try {
    const res = await apiClient.request<T>({ ...config });
    return opts?.raw ? res : (res.data as T);
  } catch (err) {
    mapAxiosError(err);
  }
}

export const http = {
  get: <T>(endpoint: Endpoint, { params, opts }: { params?: any; opts?: HttpOptions } = {}) =>
    request<T>({ method: "get", url: endpoint.path, params, isPublic: endpoint.isPublic }, opts),
  post: <T, B = any>(endpoint: Endpoint, { body, opts }: { body?: B; opts?: HttpOptions } = {}) =>
    request<T>(
      { method: "post", url: endpoint.path, data: body, isPublic: endpoint.isPublic },
      opts,
    ),
  put: <T, B = any>(endpoint: Endpoint, { body, opts }: { body?: B; opts?: HttpOptions } = {}) =>
    request<T>(
      { method: "put", url: endpoint.path, data: body, isPublic: endpoint.isPublic },
      opts,
    ),
  patch: <T, B = any>(endpoint: Endpoint, { body, opts }: { body?: B; opts?: HttpOptions } = {}) =>
    request<T>(
      { method: "patch", url: endpoint.path, data: body, isPublic: endpoint.isPublic },
      opts,
    ),
  del: <T>(endpoint: Endpoint, { opts }: { opts?: HttpOptions } = {}) =>
    request<T>({ method: "delete", url: endpoint.path, isPublic: endpoint.isPublic }, opts),
};

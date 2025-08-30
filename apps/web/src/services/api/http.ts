// apps/web/src/lib/http.ts
import apiClient from "./api-client";
import { AxiosRequestConfig } from "axios";
import { ApiError } from "./api-errors";

export type HttpOptions = {
  raw?: boolean; // if true, return the full AxiosResponse
  isPublic?: boolean; // if true, do not attach authentication headers
  signal?: AbortSignal;
};

export const httpOptionsDefaults: HttpOptions = {
  raw: false,
  isPublic: false,
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
    const res = await apiClient.request<T>({ ...config, ...httpOptionsDefaults });
    return opts?.raw ? res : (res.data as T);
  } catch (err) {
    mapAxiosError(err);
  }
}

export const http = {
  get: <T>(url: string, { params, opts }: { params?: any; opts?: HttpOptions } = {}) =>
    request<T>({ method: "get", url, params }, { ...httpOptionsDefaults, ...opts }),
  post: <T, B = any>(url: string, { body, opts }: { body?: B; opts?: HttpOptions } = {}) =>
    request<T>({ method: "post", url, data: body }, { ...httpOptionsDefaults, ...opts }),
  put: <T, B = any>(url: string, { body, opts }: { body?: B; opts?: HttpOptions } = {}) =>
    request<T>({ method: "put", url, data: body }, { ...httpOptionsDefaults, ...opts }),
  patch: <T, B = any>(url: string, { body, opts }: { body?: B; opts?: HttpOptions } = {}) =>
    request<T>({ method: "patch", url, data: body }, { ...httpOptionsDefaults, ...opts }),
  del: <T>(url: string, { opts }: { opts?: HttpOptions } = {}) =>
    request<T>({ method: "delete", url }, { ...httpOptionsDefaults, ...opts }),
};

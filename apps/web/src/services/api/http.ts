import { AxiosRequestConfig } from "axios";
import { ApiError } from "./api-errors";
import { Endpoint } from "@/types/endpoint-type";
import { apiClient } from "./api-client";

export type HttpOptions = {
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

export async function request<T = any>(config: AxiosRequestConfig, opts?: HttpOptions): Promise<T> {
  try {
    const res = await apiClient.request<T>({ ...config });
    return res.data as T;
  } catch (err) {
    mapAxiosError(err);
  }
}

const mapPathParams = (path: string, pathParams: Record<string, string> = {}): string => {
  return Object.entries(pathParams).reduce(
    (acc, [key, value]) => acc.replace(`:${key}`, value),
    path,
  );
};

export const http = {
  get: <T>(
    endpoint: Endpoint,
    {
      params,
      pathParams,
      opts,
    }: { params?: any; pathParams?: Record<string, string>; opts?: HttpOptions } = {},
  ): Promise<T> => {
    const url = pathParams ? mapPathParams(endpoint.path, pathParams) : endpoint.path;
    return request<T>({ method: "get", url, params, isPublic: endpoint.isPublic }, opts);
  },
  post: <T, B = any>(
    endpoint: Endpoint,
    {
      body,
      pathParams,
      opts,
    }: { body?: B; pathParams?: Record<string, string>; opts?: HttpOptions } = {},
  ): Promise<T> => {
    const url = pathParams ? mapPathParams(endpoint.path, pathParams) : endpoint.path;
    return request<T>({ method: "post", url, data: body, isPublic: endpoint.isPublic }, opts);
  },
  put: <T, B = any>(
    endpoint: Endpoint,
    {
      body,
      pathParams,
      opts,
    }: { body?: B; pathParams?: Record<string, string>; opts?: HttpOptions } = {},
  ): Promise<T> => {
    const url = pathParams ? mapPathParams(endpoint.path, pathParams) : endpoint.path;
    return request<T>({ method: "put", url, data: body, isPublic: endpoint.isPublic }, opts);
  },
  patch: <T, B = any>(
    endpoint: Endpoint,
    {
      body,
      pathParams,
      opts,
    }: { body?: B; pathParams?: Record<string, string>; opts?: HttpOptions } = {},
  ): Promise<T> => {
    const url = pathParams ? mapPathParams(endpoint.path, pathParams) : endpoint.path;
    return request<T>({ method: "patch", url, data: body, isPublic: endpoint.isPublic }, opts);
  },
  del: <T>(
    endpoint: Endpoint,
    { pathParams, opts }: { pathParams?: Record<string, string>; opts?: HttpOptions } = {},
  ): Promise<T> => {
    const url = pathParams ? mapPathParams(endpoint.path, pathParams) : endpoint.path;
    return request<T>({ method: "delete", url, isPublic: endpoint.isPublic }, opts);
  },
};

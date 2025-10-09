import type { DefaultOptions } from "@tanstack/react-query";

export const defaultReactQueryOptions: DefaultOptions = {
  queries: {
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    retry: 1,
  },
  mutations: {
    retry: 0,
  },
};

export const makeListQueryOptions = (enabled = true) => ({
  enabled,
  keepPreviousData: true,
  staleTime: 0,
});

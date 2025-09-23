export const useCaseQueryKeys = {
  list: ["useCases"],
  detail: (id: string) => [...useCaseQueryKeys.list, "detail", id],
} as const;

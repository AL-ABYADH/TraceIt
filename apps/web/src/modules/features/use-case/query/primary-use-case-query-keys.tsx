export const primaryUseCaseQueryKeys = {
  list: ["primaryUseCases"],
  detail: (id: string) => [...primaryUseCaseQueryKeys.list, "detail", id],
} as const;

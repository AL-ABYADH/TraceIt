export const useCaseQueryKeys = {
  list: () => ["useCases"],
  primaryList: () => ["primaryUseCases"],
  secondaryList: () => ["secondaryUseCases"],
  detail: (id: string) => ["useCases", "detail", id],
  primaryDetail: (id: string) => ["primaryUseCases", "detail", id],
  secondaryDetail: (id: string) => ["secondaryUseCases", "detail", id],
} as const;

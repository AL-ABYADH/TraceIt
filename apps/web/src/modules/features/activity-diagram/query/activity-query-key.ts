export const activityQueryKeys = {
  list: ["useCases"],
  detail: (id: string) => [...activityQueryKeys.list, "detail", id],
} as const;

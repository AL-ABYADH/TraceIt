export const activityQueryKeys = {
  list: ["activities"],
  detail: (id: string) => [...activityQueryKeys.list, "detail", id],
} as const;

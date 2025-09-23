export const actorQueryKeys = {
  list: ["actors"],
  detail: (id: string) => [...actorQueryKeys.list, "detail", id],
} as const;

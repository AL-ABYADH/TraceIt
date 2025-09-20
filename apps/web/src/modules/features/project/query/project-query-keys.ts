export const projectQueryKeys = {
  list: ["projects"],
  detail: (id: string) => [...projectQueryKeys.list, "detail", id],
} as const;

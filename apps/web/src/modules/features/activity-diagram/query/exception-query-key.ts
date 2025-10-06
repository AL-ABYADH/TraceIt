export const exceptionQueryKeys = {
  list: ["exceptions"],
  detail: (id: string) => [...exceptionQueryKeys.list, "detail", id],
} as const;

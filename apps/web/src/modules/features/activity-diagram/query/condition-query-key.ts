// query/condition-query-key.ts
export const conditionQueryKeys = {
  list: ["conditions"],
  listByUseCase: (useCaseId?: string) =>
    useCaseId ? [...conditionQueryKeys.list, "use-case", useCaseId] : conditionQueryKeys.list,
  detail: (id: string) => [...conditionQueryKeys.list, "detail", id],
} as const;

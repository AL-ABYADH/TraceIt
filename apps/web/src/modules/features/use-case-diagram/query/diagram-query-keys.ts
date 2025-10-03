export const diagramQueryKeys = {
  list: ["diagrams"],
  detail: (id: string) => [...diagramQueryKeys.list, "detail", id],
  byRelation: (id: string) => [...diagramQueryKeys.list, "byRelation", id],
} as const;

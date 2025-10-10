const PREFIX = "/diagrams";

export const diagramEndpoints = {
  list: {
    path: PREFIX,
    isPublic: false,
  },
  detail: {
    path: `${PREFIX}/:id`,
    isPublic: false,
  },
  byRelation: {
    path: `${PREFIX}/by-relation/:relationId`,
    isPublic: false,
  },
} as const;

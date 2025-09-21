const PREFIX = "/projects";

export const projectEndpoints = {
  list: {
    path: PREFIX,
    isPublic: false,
  },
  detail: {
    path: `${PREFIX}/:id`,
    isPublic: false,
  },
} as const;

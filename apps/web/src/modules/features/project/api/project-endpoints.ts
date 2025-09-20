const PREFIX = "/projects";

export const projectEndpoints = {
  root: {
    path: PREFIX,
    isPublic: false,
  },
  detail: {
    path: `${PREFIX}/:id`,
    isPublic: false,
  },
} as const;

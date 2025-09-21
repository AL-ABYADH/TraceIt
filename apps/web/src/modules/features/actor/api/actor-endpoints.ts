const PREFIX = "/actors";

export const actorEndpoints = {
  list: {
    path: PREFIX,
    isPublic: false,
  },
  detail: {
    path: `${PREFIX}/:id`,
    isPublic: false,
  },
} as const;

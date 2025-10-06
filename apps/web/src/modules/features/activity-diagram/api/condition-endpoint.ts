const CONDITION_PREFIX = "/conditions";

export const conditionEndpoint = {
  list: {
    path: CONDITION_PREFIX,
    isPublic: false,
  },
  detail: {
    path: `${CONDITION_PREFIX}/:id`,
    isPublic: false,
  },
} as const;

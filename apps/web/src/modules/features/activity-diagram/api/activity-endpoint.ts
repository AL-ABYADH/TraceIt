const Activity_PREFIX = "/use-cases";

export const activityEndpoint = {
  list: {
    path: Activity_PREFIX,
    isPublic: false,
  },
  detail: {
    path: `${Activity_PREFIX}/:id`,
    isPublic: false,
  },
} as const;

const Activity_PREFIX = "/activities";

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

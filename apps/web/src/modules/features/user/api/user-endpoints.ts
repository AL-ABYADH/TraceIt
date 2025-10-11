const PREFIX = "/users";

export const userEndpoints = {
  me: {
    path: `${PREFIX}/me`,
    isPublic: false,
  },
} as const;

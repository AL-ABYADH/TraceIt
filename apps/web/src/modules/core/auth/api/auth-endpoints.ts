const PREFIX = "/auth";

export const authEndpoints = {
  register: {
    path: `${PREFIX}/register`,
    isPublic: true,
  },
  login: {
    path: `${PREFIX}/login`,
    isPublic: true,
  },
  logout: {
    path: `${PREFIX}/logout`,
    isPublic: false,
  },
} as const;

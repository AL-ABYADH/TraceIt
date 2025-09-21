const USE_CASE_PREFIX = "/use-cases";
const PRIMARY_USE_CASE_PREFIX = "/primary-use-cases";
const SECONDARY_USE_CASE_PREFIX = "/secondary-use-cases";

export const useCaseEndpoints = {
  list: {
    path: USE_CASE_PREFIX,
    isPublic: false,
  },
  detail: {
    path: `${USE_CASE_PREFIX}/:id`,
    isPublic: false,
  },
} as const;

export const primaryUseCaseEndpoints = {
  list: {
    path: PRIMARY_USE_CASE_PREFIX,
    isPublic: false,
  },
  detail: {
    path: `${PRIMARY_USE_CASE_PREFIX}/:id`,
    isPublic: false,
  },
} as const;

export const secondaryUseCaseEndpoints = {
  list: {
    path: SECONDARY_USE_CASE_PREFIX,
    isPublic: false,
  },
  detail: {
    path: `${SECONDARY_USE_CASE_PREFIX}/:id`,
    isPublic: false,
  },
} as const;

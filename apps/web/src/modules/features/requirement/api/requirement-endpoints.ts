const REQUIREMENT_PREFIX = "requirements";
const REQUIREMENT_EXCEPTION_PREFIX = "requirement-exceptions";

export const requirementEndpoints = {
  list: {
    path: REQUIREMENT_PREFIX,
    isPublic: false,
  },
  detail: {
    path: `${REQUIREMENT_PREFIX}/:id`,
    isPublic: false,
  },
  relationships: {
    path: "requirements/:requirementId/relationships",
    isPublic: false,
  },
} as const;

export const useCaseRequirementsEndpoints = {
  list: {
    path: `${REQUIREMENT_PREFIX}/use-case/:useCaseId`,
    isPublic: false,
  },
  allRequirements: {
    path: `${REQUIREMENT_PREFIX}/use-case/:useCaseId/all-requirements`,
    isPublic: false,
  },
} as const;

export const requirementExceptionEndpoints = {
  list: {
    path: REQUIREMENT_EXCEPTION_PREFIX,
    isPublic: false,
  },
  detail: {
    path: `${REQUIREMENT_EXCEPTION_PREFIX}/:id`,
    isPublic: false,
  },
} as const;

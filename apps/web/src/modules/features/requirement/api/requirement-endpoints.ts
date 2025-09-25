const PREFIX = "requirements";

export const requirementEndpoints = {
  list: {
    path: PREFIX,
    isPublic: false,
  },
  detail: {
    path: `${PREFIX}/:id`,
    isPublic: false,
  },
} as const;

export const useCaseRequirementsEndpoints = {
  list: {
    path: `${PREFIX}/use-case/:useCaseId`,
    isPublic: false,
  },
} as const;

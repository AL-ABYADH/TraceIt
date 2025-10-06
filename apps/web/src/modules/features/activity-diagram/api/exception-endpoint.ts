const EXCEPTION_PREFIX = "/requirement-exceptions";

export const exceptionEndpoint = {
  listByUseCase: {
    path: `${EXCEPTION_PREFIX}/use-case/:useCaseId`,
    isPublic: false,
  },
  detail: {
    path: `${EXCEPTION_PREFIX}/:id`,
    isPublic: false,
  },
} as const;

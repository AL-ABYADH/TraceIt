import { http } from "@/services/api/http";
import { RequirementExceptionDto } from "@repo/shared-schemas";
import { exceptionEndpoint } from "../exception-endpoint";

/**
 * List exceptions for a specific use case
 */
async function listUseCaseExceptions(useCaseId: string): Promise<RequirementExceptionDto[]> {
  // Replace path parameter safely
  const endpoint = {
    ...exceptionEndpoint.listByUseCase,
    path: exceptionEndpoint.listByUseCase.path.replace(":useCaseId", useCaseId),
  };

  // Call the typed HTTP client
  return http.get<RequirementExceptionDto[]>(endpoint);
}

/**
 * Export client API
 */
export const exceptionClient = {
  listUseCaseExceptions,
};

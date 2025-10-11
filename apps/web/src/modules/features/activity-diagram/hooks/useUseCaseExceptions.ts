import { useQuery } from "@tanstack/react-query";
import { exceptionClient } from "../api/clients/exceptionClient";
import { RequirementExceptionDto } from "@repo/shared-schemas";
import { exceptionQueryKeys } from "../query/exception-query-key";

export function useExceptions(useCaseId?: string, options?: { enabled?: boolean }) {
  return useQuery<RequirementExceptionDto[]>({
    queryKey: [...exceptionQueryKeys.list, useCaseId],
    queryFn: () => exceptionClient.listUseCaseExceptions(useCaseId!),
    enabled: !!useCaseId && (options?.enabled ?? true), // Now options is defined
  });
}

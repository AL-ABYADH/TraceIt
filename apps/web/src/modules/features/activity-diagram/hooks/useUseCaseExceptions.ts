import { useQuery } from "@tanstack/react-query";
import { exceptionClient } from "../api/clients/exceptionClient";
import { RequirementExceptionDetailDto } from "@repo/shared-schemas";
import { exceptionQueryKeys } from "../query/exception-query-key";

export function useExceptions(useCaseId?: string) {
  return useQuery<RequirementExceptionDetailDto[]>({
    queryKey: [...exceptionQueryKeys.list, useCaseId],
    queryFn: () => exceptionClient.listUseCaseExceptions(useCaseId!),
    enabled: !!useCaseId,
  });
}

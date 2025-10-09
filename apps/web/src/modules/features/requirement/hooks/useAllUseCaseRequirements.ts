import { useQuery } from "@tanstack/react-query";
import { requirementClient } from "../api/clients/requirement-client";
import { requirementQueryKeys } from "../query/requirement-query-keys";

export function useAllRequirementsUnderUseCase(
  useCaseId: string,
  options: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: requirementQueryKeys.allRequirementsUnderUseCase(useCaseId),
    queryFn: () => requirementClient.listAllRequirementsUnderUseCase(useCaseId),
    enabled: options.enabled,
  });
}

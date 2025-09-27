import { useQuery } from "@tanstack/react-query";
import { requirementQueryKeys } from "../query/requirement-query-keys";
import { requirementClient } from "../api/clients/requirement-client";

export function useUseCasesRequirements(useCaseId: string) {
  return useQuery({
    queryKey: requirementQueryKeys.useCaseRequirementList(useCaseId),
    queryFn: () => requirementClient.listUseCaseRequirements(useCaseId),
  });
}

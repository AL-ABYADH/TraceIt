import { useQuery } from "@tanstack/react-query";
import { requirementClient } from "../api/clients/requirement-client";
import { requirementQueryKeys } from "../query/requirement-query-keys";

export function useRequirementRelationships(requirementId?: string) {
  return useQuery({
    queryKey: requirementQueryKeys.relationships(requirementId!),
    queryFn: () => requirementClient.getRequirementRelationships({ requirementId: requirementId! }),
    enabled: !!requirementId,
  });
}

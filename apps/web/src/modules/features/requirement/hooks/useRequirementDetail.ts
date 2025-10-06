import { useQuery } from "@tanstack/react-query";
import { requirementClient } from "../api/clients/requirement-client";

export function useRequirementDetail(requirementId?: string, enabled = true) {
  return useQuery({
    queryKey: ["requirement", "detail", requirementId],
    queryFn: () => requirementClient.getRequirement(requirementId as string),
    enabled: enabled && !!requirementId,
  });
}

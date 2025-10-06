import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateRequirementDto } from "@repo/shared-schemas";
import { requirementClient } from "../api/clients/requirement-client";
import { requirementQueryKeys } from "../query/requirement-query-keys";

export function useUpdateRequirement(
  requirementId: string,
  useCaseIdToInvalidate: string,
  opts?: {
    onSuccess?: (data: unknown, variables: UpdateRequirementDto) => void;
    onError?: (error: unknown, variables?: UpdateRequirementDto) => void;
  },
) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateRequirementDto) =>
      requirementClient.updateRequirement(requirementId, payload),
    onSettled: () => {
      qc.invalidateQueries({
        queryKey: requirementQueryKeys.useCaseRequirementList(useCaseIdToInvalidate),
      });
    },
    onSuccess: (data, variables) => {
      opts?.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      opts?.onError?.(error, variables);
    },
  });
}

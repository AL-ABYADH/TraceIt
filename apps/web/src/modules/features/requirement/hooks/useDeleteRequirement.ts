import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requirementClient } from "../api/clients/requirement-client";
import { requirementQueryKeys } from "../query/requirement-query-keys";
import { showSuccessNotification } from "@/components/notifications";

type UseDeleteRequirementOptions = {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
};

export function useDeleteRequirement(
  requirementId: string,
  useCaseIdToInvalidate: string,
  opts?: UseDeleteRequirementOptions,
) {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => requirementClient.removeRequirement(requirementId),
    onSettled: () => {
      qc.invalidateQueries({
        queryKey: requirementQueryKeys.useCaseRequirementList(useCaseIdToInvalidate),
      });
    },
    onSuccess: (data) => {
      qc.invalidateQueries({
        queryKey: requirementQueryKeys.useCaseRequirementList(useCaseIdToInvalidate),
      });
      showSuccessNotification("Requirement deleted successfully");
      opts?.onSuccess?.(data);
    },
    onError: (error) => {
      opts?.onError?.(error);
    },
  });

  return mutation;
}

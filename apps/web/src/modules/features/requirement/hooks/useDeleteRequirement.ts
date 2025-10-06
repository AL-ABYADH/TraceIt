import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requirementClient } from "../api/clients/requirement-client";
import { requirementQueryKeys } from "../query/requirement-query-keys";

type UseDeletePrimaryUseCaseOptions = {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
};

export function useDeletePrimaryUseCase(
  requirementId: string,
  useCaseIdToInvalidate: string,
  opts?: UseDeletePrimaryUseCaseOptions,
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
      opts?.onSuccess?.(data);
    },
    onError: (error) => {
      opts?.onError?.(error);
    },
  });

  return mutation;
}

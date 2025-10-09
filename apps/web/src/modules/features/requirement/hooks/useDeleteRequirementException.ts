import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requirementExceptionClient } from "../api/clients/requirement-exception-client";
import { requirementQueryKeys } from "../query/requirement-query-keys";

type UseDeleteRequirementExceptionOptions = {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
};

export function useDeleteRequirementException(
  exceptionId: string,
  useCaseIdToInvalidate: string,
  opts?: UseDeleteRequirementExceptionOptions,
) {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => requirementExceptionClient.removeRequirementException(exceptionId),
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

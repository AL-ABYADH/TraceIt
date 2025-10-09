import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateRequirementExceptionDto } from "@repo/shared-schemas";
import { requirementExceptionClient } from "../api/clients/requirement-exception-client";
import { requirementQueryKeys } from "../query/requirement-query-keys";

export function useUpdateRequirementException(
  exceptionId: string,
  useCaseIdToInvalidate: string,
  opts?: {
    onSuccess?: (data: unknown, variables: UpdateRequirementExceptionDto) => void;
    onError?: (error: unknown, variables?: UpdateRequirementExceptionDto) => void;
  },
) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateRequirementExceptionDto) =>
      requirementExceptionClient.updateRequirementException(exceptionId, payload),
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

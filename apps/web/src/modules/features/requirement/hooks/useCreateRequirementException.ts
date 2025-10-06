import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requirementClient } from "../api/clients/requirement-exception-client";
import { requirementQueryKeys } from "../query/requirement-query-keys";
import { CreateRequirementExceptionDto } from "@repo/shared-schemas";

export function useCreateRequirementException(
  useCaseId: string,
  opts?: {
    onSuccess?: (data: unknown, variables: CreateRequirementExceptionDto) => void;
    onError?: (error: unknown, variables?: CreateRequirementExceptionDto) => void;
  },
) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (exception: CreateRequirementExceptionDto) =>
      requirementClient.createRequirementException(exception),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: requirementQueryKeys.useCaseRequirementList(useCaseId) });
    },
    onSuccess: (data, variables) => {
      opts?.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      opts?.onError?.(error, variables);
    },
  });
}

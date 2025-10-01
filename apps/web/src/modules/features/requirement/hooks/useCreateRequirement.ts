import { CreateRequirementDto } from "@repo/shared-schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requirementClient } from "../api/clients/requirement-client";
import { requirementQueryKeys } from "../query/requirement-query-keys";

type UseCreateRequirementOptions = {
  onSuccess?: (data: unknown, variables: CreateRequirementDto) => void;
  onError?: (error: unknown, variables?: CreateRequirementDto) => void;
};

export function useCreateRequirement(useCaseId: string, opts?: UseCreateRequirementOptions) {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (requirement: CreateRequirementDto) =>
      requirementClient.createRequirement(requirement),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: requirementQueryKeys.useCaseRequirementList(useCaseId) });
    },
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: requirementQueryKeys.useCaseRequirementList(useCaseId) });
      opts?.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      opts?.onError?.(error, variables);
    },
  });

  const mutate = (requirement: CreateRequirementDto) => mutation.mutate(requirement);
  const mutateAsync = (requirement: CreateRequirementDto) => mutation.mutateAsync(requirement);

  return { ...mutation, mutate, mutateAsync };
}

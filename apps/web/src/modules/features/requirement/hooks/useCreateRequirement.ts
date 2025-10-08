import { CreateRequirementDto } from "@repo/shared-schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react"; // <-- Add this line
import { requirementClient } from "../api/clients/requirement-client";
import { requirementQueryKeys } from "../query/requirement-query-keys";

type UseCreateRequirementOptions = {
  onSuccess?: (data: unknown, variables: CreateRequirementDto) => void;
  onError?: (error: unknown, variables?: CreateRequirementDto) => void;
};

export function useCreateRequirement(useCaseId: string, opts?: UseCreateRequirementOptions) {
  const qc = useQueryClient();

  const [isUpdating, setIsUpdating] = useState(false);
  const mutation = useMutation({
    mutationFn: (requirement: CreateRequirementDto) => {
      setIsUpdating(true);
      return requirementClient.createRequirement(requirement);
    },
    onSettled: async () => {
      await qc.invalidateQueries({
        queryKey: requirementQueryKeys.useCaseRequirementList(useCaseId),
      });
      setIsUpdating(false);
    },
    onSuccess: (data, variables) => {
      opts?.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      opts?.onError?.(error, variables);
    },
  });

  const mutate = (requirement: CreateRequirementDto) => mutation.mutate(requirement);
  const mutateAsync = (requirement: CreateRequirementDto) => mutation.mutateAsync(requirement);

  return { ...mutation, mutate, mutateAsync, isUpdating };
}

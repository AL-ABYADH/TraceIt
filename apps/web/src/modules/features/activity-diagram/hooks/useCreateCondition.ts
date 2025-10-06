// hooks/useCreateCondition.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { conditionClient } from "../api/clients/conditionClient";
import { CreateConditionDto, ConditionDto } from "@repo/shared-schemas";
import { conditionQueryKeys } from "../query/condition-query-key";

type UseCreateConditionOptions = {
  onSuccess?: (data: ConditionDto, variables: CreateConditionDto) => void;
  onError?: (error: unknown, variables?: CreateConditionDto) => void;
};

export function useCreateCondition(opts?: UseCreateConditionOptions) {
  const queryClient = useQueryClient();

  const mutation = useMutation<ConditionDto, unknown, CreateConditionDto>({
    mutationFn: (condition: CreateConditionDto) => conditionClient.createCondition(condition),
    onSuccess: (data, variables) => {
      console.log("🔄 Invalidating conditions queries after creation");

      // Invalidate use case specific conditions
      queryClient.invalidateQueries({
        queryKey: conditionQueryKeys.listByUseCase(variables.useCaseId),
      });

      // Also invalidate the general conditions list (without useCaseId)
      queryClient.invalidateQueries({
        queryKey: conditionQueryKeys.list,
      });

      console.log("✅ Conditions queries invalidated for use case:", variables.useCaseId);

      opts?.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      console.error("❌ Condition creation failed:", error);
      opts?.onError?.(error, variables);
    },
  });

  const mutate = (condition: CreateConditionDto) => mutation.mutate(condition);
  const mutateAsync = (condition: CreateConditionDto) => mutation.mutateAsync(condition);

  return { ...mutation, mutate, mutateAsync };
}

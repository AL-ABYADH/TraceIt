import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreatePrimaryUseCaseDto } from "@repo/shared-schemas";
import { primaryUseCaseClient } from "../api/clients/primary-use-case-client";
import { useCaseQueryKeys } from "../query/use-case-query-keys";

type UseCreatePrimaryUseCaseOptions = {
  onSuccess?: (data: unknown, variables: CreatePrimaryUseCaseDto) => void;
  onError?: (error: unknown, variables?: CreatePrimaryUseCaseDto) => void;
};

export function useCreatePrimaryUseCase(opts?: UseCreatePrimaryUseCaseOptions) {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (useCase: CreatePrimaryUseCaseDto) =>
      primaryUseCaseClient.createPrimaryUseCase(useCase),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: useCaseQueryKeys.list() });
    },
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: useCaseQueryKeys.list() });
      opts?.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      opts?.onError?.(error, variables);
    },
  });

  const mutate = (useCase: CreatePrimaryUseCaseDto) => mutation.mutate(useCase);
  const mutateAsync = (useCase: CreatePrimaryUseCaseDto) => mutation.mutateAsync(useCase);

  return { ...mutation, mutate, mutateAsync };
}

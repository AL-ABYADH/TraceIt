import { UpdatePrimaryUseCaseDto } from "@repo/shared-schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { primaryUseCaseClient } from "../api/clients/primary-use-case-client";
import { primaryUseCaseQueryKeys } from "../query/primary-use-case-query-keys";
import { useCaseQueryKeys } from "../query/use-case-query-keys";

type UseUpdatePrimaryUseCaseOptions = {
  onSuccess?: (data: unknown, variables: UpdatePrimaryUseCaseDto) => void;
  onError?: (error: unknown, variables?: UpdatePrimaryUseCaseDto) => void;
};

export function useUpdatePrimaryUseCase(useCaseId: string, opts?: UseUpdatePrimaryUseCaseOptions) {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (useCase: UpdatePrimaryUseCaseDto) =>
      primaryUseCaseClient.updatePrimaryUseCase(useCaseId, useCase),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: useCaseQueryKeys.list });
    },
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: useCaseQueryKeys.list });
      qc.invalidateQueries({ queryKey: primaryUseCaseQueryKeys.detail(useCaseId) });
      opts?.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      opts?.onError?.(error, variables);
    },
  });

  const mutate = (useCase: UpdatePrimaryUseCaseDto) => mutation.mutate(useCase);
  const mutateAsync = (useCase: UpdatePrimaryUseCaseDto) => mutation.mutateAsync(useCase);

  return { ...mutation, mutate, mutateAsync };
}

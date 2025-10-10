import { useMutation, useQueryClient } from "@tanstack/react-query";
import { secondaryUseCaseClient } from "../api/clients/secondary-use-case-client";
import { useCaseQueryKeys } from "../query/use-case-query-keys";

type UseDeleteSecondaryUseCaseOptions = {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
};

export function useDeleteSecondaryUseCase(
  useCaseId: string,
  opts?: UseDeleteSecondaryUseCaseOptions,
) {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => secondaryUseCaseClient.removeSecondaryUseCase(useCaseId),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: useCaseQueryKeys.list() });
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: useCaseQueryKeys.list() });
      opts?.onSuccess?.(data);
    },
    onError: (error) => {
      opts?.onError?.(error);
    },
  });

  return mutation;
}

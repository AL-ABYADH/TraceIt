import { useMutation, useQueryClient } from "@tanstack/react-query";
import { primaryUseCaseClient } from "../api/clients/primary-use-case-client";
import { useCaseQueryKeys } from "../query/use-case-query-keys";

type UseDeletePrimaryUseCaseOptions = {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
};

export function useDeletePrimaryUseCase(useCaseId: string, opts?: UseDeletePrimaryUseCaseOptions) {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => primaryUseCaseClient.removePrimaryUseCase(useCaseId),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: useCaseQueryKeys.list });
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: useCaseQueryKeys.list });
      opts?.onSuccess?.(data);
    },
    onError: (error) => {
      opts?.onError?.(error);
    },
  });

  return mutation;
}

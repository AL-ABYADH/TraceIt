import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actorClient } from "../api/clients/actor-client";
import { actorQueryKeys } from "../query/actor-query-keys";

type UseDeleteActorOptions = {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
};

export function useDeleteActor(actorId: string, opts?: UseDeleteActorOptions) {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => actorClient.removeActor(actorId),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: actorQueryKeys.list });
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: actorQueryKeys.list });
      opts?.onSuccess?.(data);
    },
    onError: (error) => {
      opts?.onError?.(error);
    },
  });

  return mutation;
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actorClient } from "../api/clients/actor-client";
import { UpdateActorDto } from "@repo/shared-schemas";
import { actorQueryKeys } from "../query/actor-query-keys";
import { showSuccessNotification } from "@/components/notifications";

type UseUpdateActorOptions = {
  onSuccess?: (data: unknown, variables: UpdateActorDto) => void;
  onError?: (error: unknown, variables?: UpdateActorDto) => void;
};

export function useUpdateActor(actorId: string, opts?: UseUpdateActorOptions) {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (actor: UpdateActorDto) => actorClient.updateActor(actorId, actor),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: actorQueryKeys.list });
    },
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: actorQueryKeys.list });
      showSuccessNotification("Actor updated successfully");
      opts?.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      opts?.onError?.(error, variables);
    },
  });

  const mutate = (actor: UpdateActorDto) => mutation.mutate(actor);
  const mutateAsync = (actor: UpdateActorDto) => mutation.mutateAsync(actor);

  return { ...mutation, mutate, mutateAsync };
}

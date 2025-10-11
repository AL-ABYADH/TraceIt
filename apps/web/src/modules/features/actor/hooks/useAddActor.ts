import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actorClient } from "../api/clients/actor-client";
import { AddActorDto } from "@repo/shared-schemas";
import { actorQueryKeys } from "../query/actor-query-keys";
import { showSuccessNotification } from "@/components/notifications";

type UseAddActorOptions = {
  onSuccess?: (data: unknown, variables: AddActorDto) => void;
  onError?: (error: unknown, variables?: AddActorDto) => void;
};

export function useAddActor(opts?: UseAddActorOptions) {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (actor: AddActorDto) => actorClient.addActor(actor),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: actorQueryKeys.list });
    },
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: actorQueryKeys.list });
      showSuccessNotification("Actor added successfully");
      opts?.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      opts?.onError?.(error, variables);
    },
  });

  const mutate = (actor: AddActorDto) => mutation.mutate(actor);
  const mutateAsync = (actor: AddActorDto) => mutation.mutateAsync(actor);

  return { ...mutation, mutate, mutateAsync };
}

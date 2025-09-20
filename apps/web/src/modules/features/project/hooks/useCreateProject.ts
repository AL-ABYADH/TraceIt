import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectClient } from "../api/clients/project-client";
import { CreateProjectDto } from "@repo/shared-schemas";
import { projectQueryKeys } from "../query/project-query-keys";

type UseCreateProjectOptions = {
  onSuccess?: (data: unknown, variables: CreateProjectDto) => void;
  onError?: (error: unknown, variables?: CreateProjectDto) => void;
};

export function useCreateProject(opts?: UseCreateProjectOptions) {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (project: CreateProjectDto) => projectClient.createProject(project),
    // keep cache invalidation inside the hook
    onSettled: () => {
      qc.invalidateQueries({ queryKey: projectQueryKeys.list });
    },
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: projectQueryKeys.list });
      opts?.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      opts?.onError?.(error, variables);
    },
  });

  // expose both mutate and mutateAsync for convenience
  const mutate = (project: CreateProjectDto) => mutation.mutate(project);
  const mutateAsync = (project: CreateProjectDto) => mutation.mutateAsync(project);

  return { ...mutation, mutate, mutateAsync };
}

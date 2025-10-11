import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectClient } from "../api/clients/project-client";
import { UpdateProjectDto } from "@repo/shared-schemas";
import { projectQueryKeys } from "../query/project-query-keys";
import { showSuccessNotification } from "@/components/notifications";

type UseUpdateProjectOptions = {
  onSuccess?: (data: unknown, variables: UpdateProjectDto) => void;
  onError?: (error: unknown, variables?: UpdateProjectDto) => void;
};

export function useUpdateProject(projectId: string, opts?: UseUpdateProjectOptions) {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (project: UpdateProjectDto) => projectClient.updateProject(projectId, project),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: projectQueryKeys.list });
    },
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: projectQueryKeys.list });
      showSuccessNotification("Project updated successfully");
      opts?.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      opts?.onError?.(error, variables);
    },
  });

  const mutate = (project: UpdateProjectDto) => mutation.mutate(project);
  const mutateAsync = (project: UpdateProjectDto) => mutation.mutateAsync(project);

  return { ...mutation, mutate, mutateAsync };
}

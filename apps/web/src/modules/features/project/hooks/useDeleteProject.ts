import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectClient } from "../api/clients/project-client";
import { projectQueryKeys } from "../query/project-query-keys";
import { showSuccessNotification } from "@/components/notifications";

type UseDeleteProjectOptions = {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
};

export function useDeleteProject(projectId: string, opts?: UseDeleteProjectOptions) {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => projectClient.removeProject(projectId),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: projectQueryKeys.list });
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: projectQueryKeys.list });
      showSuccessNotification("Project deleted successfully");
      opts?.onSuccess?.(data);
    },
    onError: (error) => {
      opts?.onError?.(error);
    },
  });

  return mutation;
}

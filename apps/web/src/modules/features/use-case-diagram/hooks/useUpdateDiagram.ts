import { useMutation, useQueryClient } from "@tanstack/react-query";
import { diagramClient } from "../api/clients/diagram-client";
import { DiagramElementsDto } from "@repo/shared-schemas";
import { diagramQueryKeys } from "../query/diagram-query-keys";

type UseUpdateDiagramOptions = {
  onSuccess?: (data: unknown, variables: DiagramElementsDto) => void;
  onError?: (error: unknown, variables?: DiagramElementsDto) => void;
};

export function useUpdateDiagram(
  { diagramId }: { diagramId: string },
  opts?: UseUpdateDiagramOptions,
) {
  const mutation = useMutation({
    mutationFn: (diagram: DiagramElementsDto) => diagramClient.updateDiagram(diagramId, diagram),
    onSuccess: (data, variables) => {
      opts?.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      opts?.onError?.(error, variables);
    },
  });

  const mutate = (diagram: DiagramElementsDto) => mutation.mutate(diagram);
  const mutateAsync = (diagram: DiagramElementsDto) => mutation.mutateAsync(diagram);

  return { ...mutation, mutate, mutateAsync };
}

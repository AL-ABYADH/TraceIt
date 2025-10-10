import { useMutation } from "@tanstack/react-query";
import { DiagramElementsDto } from "@repo/shared-schemas";
import { diagramClient } from "@/modules/core/flow/api/clients/diagram-client";

type UseUpdateDiagramOptions = {
  onSuccess?: (
    data: unknown,
    variables: { diagramId: string; diagram: DiagramElementsDto },
  ) => void;
  onError?: (
    error: unknown,
    variables?: { diagramId: string; diagram: DiagramElementsDto },
  ) => void;
};

export function useUpdateDiagram(opts?: UseUpdateDiagramOptions) {
  const mutation = useMutation({
    mutationFn: ({ diagramId, diagram }: { diagramId: string; diagram: DiagramElementsDto }) =>
      diagramClient.updateDiagram(diagramId, diagram),
    onSuccess: (data, variables) => {
      opts?.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      opts?.onError?.(error, variables);
    },
  });

  const mutate = (variables: { diagramId: string; diagram: DiagramElementsDto }) =>
    mutation.mutate(variables);
  const mutateAsync = (variables: { diagramId: string; diagram: DiagramElementsDto }) =>
    mutation.mutateAsync(variables);

  return { ...mutation, mutate, mutateAsync };
}

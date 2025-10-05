import { CreateDiagramDto, DiagramType, DiagramListDto } from "@repo/shared-schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { diagramClient } from "../api/clients/diagram-client";
import { diagramQueryKeys } from "../query/diagram-query-keys";

type CreateUseCaseDiagramInput = {
  projectId: string;
};

type UseCreateUseCaseDiagramOptions = {
  onSuccess?: (data: DiagramListDto, variables: CreateUseCaseDiagramInput) => void;
  onError?: (error: unknown, variables: CreateUseCaseDiagramInput) => void;
};

export function useCreateUseCaseDiagram(opts?: UseCreateUseCaseDiagramOptions) {
  const qc = useQueryClient();

  const mutation = useMutation<DiagramListDto, unknown, CreateUseCaseDiagramInput>({
    mutationFn: ({ projectId }: CreateUseCaseDiagramInput) => {
      const diagramData: CreateDiagramDto = {
        projectId,
        relatedEntityId: projectId,
        type: DiagramType.USE_CASE,
      };
      return diagramClient.createDiagram(diagramData);
    },
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: diagramQueryKeys.byRelation(variables.projectId) });
      opts?.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      opts?.onError?.(error, variables);
    },
  });

  const mutate = (input: CreateUseCaseDiagramInput) => mutation.mutate(input);
  const mutateAsync = (input: CreateUseCaseDiagramInput) => mutation.mutateAsync(input);

  return { ...mutation, mutate, mutateAsync };
}

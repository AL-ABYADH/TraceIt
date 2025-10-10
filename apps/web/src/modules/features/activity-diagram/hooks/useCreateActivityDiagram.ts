import { CreateDiagramDto, DiagramType, DiagramListDto } from "@repo/shared-schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { diagramClient } from "../../../core/flow/api/clients/diagram-client";
import { diagramQueryKeys } from "../../use-case-diagram/query/diagram-query-keys";

type CreateActivityDiagramInput = {
  useCaseId: string;
  projectId: string;
};

type UseCreateActivityDiagramOptions = {
  onSuccess?: (data: DiagramListDto, variables: CreateActivityDiagramInput) => void;
  onError?: (error: unknown, variables: CreateActivityDiagramInput) => void;
};

export function useCreateActivityDiagram(opts?: UseCreateActivityDiagramOptions) {
  const qc = useQueryClient();

  const mutation = useMutation<DiagramListDto, unknown, CreateActivityDiagramInput>({
    mutationFn: ({ useCaseId, projectId }: CreateActivityDiagramInput) => {
      const diagramData: CreateDiagramDto = {
        projectId,
        relatedEntityId: useCaseId,
        type: DiagramType.ACTIVITY,
      };
      return diagramClient.createDiagram(diagramData);
    },
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: diagramQueryKeys.byRelation(variables.useCaseId) });
      opts?.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      opts?.onError?.(error, variables);
    },
  });

  const mutate = (input: CreateActivityDiagramInput) => mutation.mutate(input);
  const mutateAsync = (input: CreateActivityDiagramInput) => mutation.mutateAsync(input);

  return { ...mutation, mutate, mutateAsync };
}

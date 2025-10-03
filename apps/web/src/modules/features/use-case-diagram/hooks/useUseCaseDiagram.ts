import { useQuery } from "@tanstack/react-query";
import { diagramClient } from "../api/clients/diagram-client";
import { diagramQueryKeys } from "../query/diagram-query-keys";
import { DiagramType } from "@repo/shared-schemas";

export const useUseCaseDiagram = (projectId: string) => {
  return useQuery({
    queryKey: diagramQueryKeys.byRelation(projectId),
    queryFn: () => diagramClient.getDiagramByRelation(projectId, DiagramType.USE_CASE),
  });
};

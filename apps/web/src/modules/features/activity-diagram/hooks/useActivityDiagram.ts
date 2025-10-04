import { useQuery } from "@tanstack/react-query";
import { diagramQueryKeys } from "../../use-case-diagram/query/diagram-query-keys";
import { diagramClient } from "../../use-case-diagram/api/clients/diagram-client";
import { DiagramType } from "@repo/shared-schemas";

export const useActivityDiagram = (useCaseId?: string) => {
  return useQuery({
    queryKey: diagramQueryKeys.byRelation(useCaseId!),
    queryFn: () => diagramClient.getDiagramByRelation(useCaseId!, DiagramType.ACTIVITY),
    enabled: !!useCaseId,
  });
};

async function fetchDiagram(useCaseId: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    nodes: [],
    edges: [],
    id: "id",
  };
}

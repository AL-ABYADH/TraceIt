import { useQuery } from "@tanstack/react-query";
import { diagramClient } from "../api/clients/diagram-client";
import { diagramQueryKeys } from "../query/diagram-query-keys";

export const useUseCaseDiagram = (projectId: string) => {
  return useQuery({
    queryKey: diagramQueryKeys.byRelation(projectId),
    queryFn: () => diagramClient.getUseCaseDiagram(projectId),
  });
};

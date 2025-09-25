import { EdgeType, NodeType } from "@repo/shared-schemas";
import { useQuery } from "@tanstack/react-query";

export const useUseCaseDiagram = (projectId: string) => {
  return useQuery({
    queryKey: ["diagram", projectId],
    queryFn: () => fetchDiagram(projectId),
  });
};

async function fetchDiagram(projectId: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    nodes: [],
    edges: [],
  };
}

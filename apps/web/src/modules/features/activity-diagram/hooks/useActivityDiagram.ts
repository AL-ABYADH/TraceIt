import { useQuery } from "@tanstack/react-query";

export const useActivityDiagram = (projectId: string) => {
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

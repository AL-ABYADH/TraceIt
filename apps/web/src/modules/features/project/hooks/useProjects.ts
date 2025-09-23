import { useQuery } from "@tanstack/react-query";
import { projectQueryKeys } from "../query/project-query-keys";
import { projectClient } from "../api/clients/project-client";

export function useProjects() {
  return useQuery({
    queryKey: projectQueryKeys.list,
    queryFn: () => projectClient.listActiveProjects(),
  });
}

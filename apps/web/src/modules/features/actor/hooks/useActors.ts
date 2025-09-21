import { useQuery } from "@tanstack/react-query";
import { actorQueryKeys } from "../query/actor-query-keys";
import { actorClient } from "../api/clients/actor-client";

export function useActors(projectId: string) {
  return useQuery({
    queryKey: actorQueryKeys.list,
    queryFn: () => actorClient.listProjectActors(projectId),
  });
}

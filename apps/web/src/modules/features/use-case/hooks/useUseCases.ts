import { useQuery } from "@tanstack/react-query";
import { useCaseQueryKeys } from "../query/use-case-query-keys";
import { useCaseClient } from "../api/clients/use-case-client";

export function useUseCases(projectId: string) {
  return useQuery({
    queryKey: useCaseQueryKeys.list,
    queryFn: () => useCaseClient.listProjectUseCases(projectId),
  });
}

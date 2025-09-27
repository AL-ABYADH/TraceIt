import { useQuery } from "@tanstack/react-query";
import { primaryUseCaseQueryKeys } from "../query/primary-use-case-query-keys";
import { primaryUseCaseClient } from "../api/clients/primary-use-case-client";

export function usePrimaryUseCases(projectId: string) {
  return useQuery({
    queryKey: primaryUseCaseQueryKeys.list,
    queryFn: () => primaryUseCaseClient.listPrimaryUseCases(projectId),
  });
}

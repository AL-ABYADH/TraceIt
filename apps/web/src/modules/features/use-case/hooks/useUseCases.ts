import { useQuery } from "@tanstack/react-query";
import { useCaseQueryKeys } from "../query/use-case-query-keys";
import { useCaseClient } from "../api/clients/use-case-client";
import { UseCaseSubtype } from "@repo/shared-schemas";

export function useUseCases(projectId: string, useCaseSubType?: UseCaseSubtype) {
  return useQuery({
    queryKey:
      useCaseSubType === UseCaseSubtype.PRIMARY
        ? useCaseQueryKeys.primaryList()
        : useCaseSubType === UseCaseSubtype.SECONDARY
          ? useCaseQueryKeys.secondaryList()
          : useCaseQueryKeys.list(),
    queryFn: () => {
      switch (useCaseSubType) {
        case UseCaseSubtype.PRIMARY:
          return useCaseClient.listProjectPrimaryUseCases(projectId);
        case UseCaseSubtype.SECONDARY:
          return useCaseClient.listProjectSecondaryUseCases(projectId);
        default:
          return useCaseClient.listProjectUseCases(projectId);
      }
    },
  });
}

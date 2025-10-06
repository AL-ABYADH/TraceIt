// hooks/useUseCaseConditions.ts
import { useQuery } from "@tanstack/react-query";
import { conditionQueryKeys } from "../query/condition-query-key";
import { conditionClient } from "../api/clients/conditionClient";

export function useUseCaseConditions(useCaseId?: string) {
  return useQuery({
    queryKey: conditionQueryKeys.listByUseCase(useCaseId!),
    queryFn: () => conditionClient.listConditions(useCaseId),
    enabled: !!useCaseId, // only fetch when useCaseId exists
  });
}

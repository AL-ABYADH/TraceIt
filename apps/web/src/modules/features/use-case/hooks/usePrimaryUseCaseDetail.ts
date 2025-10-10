import { PrimaryUseCaseDetailDto } from "@repo/shared-schemas";
import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { primaryUseCaseClient } from "../api/clients/primary-use-case-client";
import { primaryUseCaseQueryKeys } from "../query/primary-use-case-query-keys";

export function usePrimaryUseCaseDetail<T = PrimaryUseCaseDetailDto>(
  primaryUseCaseId: string,
  select?: (data: PrimaryUseCaseDetailDto) => T,
  options?: Omit<UseQueryOptions<PrimaryUseCaseDetailDto, Error, T>, "queryKey" | "queryFn">,
  enabled: boolean = true,
): UseQueryResult<T, Error> {
  return useQuery<PrimaryUseCaseDetailDto, Error, T>({
    queryKey: primaryUseCaseQueryKeys.detail(primaryUseCaseId),
    queryFn: () => primaryUseCaseClient.getPrimaryUseCase(primaryUseCaseId),
    select,
    enabled, // use it here
    ...options,
  });
}

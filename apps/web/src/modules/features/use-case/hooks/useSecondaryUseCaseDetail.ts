import { SecondaryUseCaseDetailDto } from "@repo/shared-schemas";
import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { secondaryUseCaseClient } from "../api/clients/secondary-use-case-client";
import { useCaseQueryKeys } from "../query/use-case-query-keys";

export function useSecondaryUseCaseDetail<T = SecondaryUseCaseDetailDto>(
  secondaryUseCaseId: string,
  select?: (data: SecondaryUseCaseDetailDto) => T,
  options?: Omit<UseQueryOptions<SecondaryUseCaseDetailDto, Error, T>, "queryKey" | "queryFn">,
  enabled: boolean = true,
): UseQueryResult<T, Error> {
  return useQuery<SecondaryUseCaseDetailDto, Error, T>({
    queryKey: useCaseQueryKeys.secondaryDetail(secondaryUseCaseId),
    queryFn: () => secondaryUseCaseClient.getSecondaryUseCase(secondaryUseCaseId),
    select,
    ...options,
    enabled,
  });
}

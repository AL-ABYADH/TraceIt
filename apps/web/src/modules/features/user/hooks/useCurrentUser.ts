import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { userClient } from "../api/clients/user-client";
import { UserDto } from "@repo/shared-schemas";
import { userQueryKeys } from "../query/user-query-keys";

export function useCurrentUser<T = UserDto>(
  select?: (data: UserDto) => T,
  options?: UseQueryOptions<UserDto, Error, T>,
): UseQueryResult<T, Error> {
  return useQuery<UserDto, Error, T>({
    queryKey: userQueryKeys.me,
    queryFn: () => userClient.getCurrentUser(),
    select,
    ...options,
  });
}

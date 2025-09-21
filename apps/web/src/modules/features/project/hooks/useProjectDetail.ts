import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { projectQueryKeys } from "../query/project-query-keys";
import { projectClient } from "../api/clients/project-client";
import { ProjectDetailDto } from "@repo/shared-schemas";

export function useProjectDetail<T = ProjectDetailDto>(
  projectId: string,
  select?: (data: ProjectDetailDto) => T,
  options?: UseQueryOptions<ProjectDetailDto, Error, T>,
): UseQueryResult<T, Error> {
  return useQuery<ProjectDetailDto, Error, T>({
    queryKey: projectQueryKeys.detail(projectId),
    queryFn: () => projectClient.getProject(projectId),
    select,
    ...options,
  });
}

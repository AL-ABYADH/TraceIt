import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { projectQueryKeys } from "../query/project-query-keys";
import { projectClient } from "../api/clients/project-client";
import { ProjectDto } from "@repo/shared-schemas";

export function useProjectDetail<T = ProjectDto>(
  projectId: string,
  select?: (data: ProjectDto) => T,
  options?: UseQueryOptions<ProjectDto, Error, T>,
): UseQueryResult<T, Error> {
  return useQuery<ProjectDto, Error, T>({
    queryKey: projectQueryKeys.detail(projectId),
    queryFn: () => projectClient.getProject(projectId),
    select,
    ...options,
  });
}

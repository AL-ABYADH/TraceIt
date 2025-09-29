import { useQuery } from "@tanstack/react-query";
import { activityQueryKeys } from "../query/activity-query-key";
import { activityClient } from "../api/clients/useActivities";

export function useActivities(projectId: string) {
  return useQuery({
    queryKey: activityQueryKeys.list,
    queryFn: () => activityClient.listProjectActivities(projectId),
  });
}

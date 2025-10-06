import { useQuery } from "@tanstack/react-query";
import { activityQueryKeys } from "../query/activity-query-key";
import { activityClient } from "../api/clients/activityClient";

export function useActivities(useCaseId?: string) {
  return useQuery({
    queryKey: [...activityQueryKeys.list, useCaseId],
    queryFn: () => activityClient.listUseCaseActivities(useCaseId!),
    enabled: !!useCaseId, // only fetch when useCaseId exists
  });
}

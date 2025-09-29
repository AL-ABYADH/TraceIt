import { http } from "@/services/api/http";
import { activityEndpoint } from "../activity-endpoint";
import { ActivityListDto } from "@repo/shared-schemas";

async function listProjectActivities(projectId: string): Promise<ActivityListDto[]> {
  return http.get(activityEndpoint.list, { params: { projectId } });
}

export const activityClient = {
  listProjectActivities,
};

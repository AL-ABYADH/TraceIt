import { http } from "@/services/api/http";
import { activityEndpoint } from "../activity-endpoint";
import { ActivityDto, CreateActivityDto } from "@repo/shared-schemas";

async function listUseCaseActivities(useCaseId: string): Promise<ActivityDto[]> {
  return http.get(activityEndpoint.list, { params: { useCaseId } });
}
async function createActivity(activity: CreateActivityDto): Promise<ActivityDto> {
  return http.post(activityEndpoint.list, { body: activity });
}

export const activityClient = {
  createActivity,
  listUseCaseActivities,
};

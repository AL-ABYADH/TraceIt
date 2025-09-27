import { http } from "@/services/api/http";
import { useCaseEndpoints } from "../use-case-endpoints";
import { UseCaseListDto } from "@repo/shared-schemas";

async function listProjectUseCases(projectId: string): Promise<UseCaseListDto[]> {
  return http.get(useCaseEndpoints.list, { params: { projectId } });
}

export const useCaseClient = {
  listProjectUseCases,
};

import { http } from "@/services/api/http";
import {
  useCaseEndpoints,
  primaryUseCaseEndpoints,
  secondaryUseCaseEndpoints,
} from "../use-case-endpoints";
import { UseCaseListDto } from "@repo/shared-schemas";

async function listProjectUseCases(projectId: string): Promise<UseCaseListDto[]> {
  return http.get(useCaseEndpoints.list, { params: { projectId } });
}

async function listProjectPrimaryUseCases(projectId: string): Promise<UseCaseListDto[]> {
  return http.get(primaryUseCaseEndpoints.list, { params: { projectId } });
}

async function listProjectSecondaryUseCases(projectId: string): Promise<UseCaseListDto[]> {
  return http.get(secondaryUseCaseEndpoints.list, { params: { projectId } });
}

export const useCaseClient = {
  listProjectUseCases,
  listProjectPrimaryUseCases,
  listProjectSecondaryUseCases,
};

import { http } from "@/services/api/http";
import { primaryUseCaseEndpoints, useCaseEndpoints } from "../use-case-endpoints";
import {
  CreatePrimaryUseCaseDto,
  UpdatePrimaryUseCaseDto,
  UseCaseDetailDto,
  UseCaseListDto,
} from "@repo/shared-schemas";

async function listProjectUseCases(projectId: string): Promise<UseCaseListDto[]> {
  return http.get(useCaseEndpoints.list, { params: { projectId } });
}

async function createPrimaryUseCase(useCase: CreatePrimaryUseCaseDto): Promise<UseCaseDetailDto> {
  return http.post(primaryUseCaseEndpoints.list, { body: useCase });
}

async function updatePrimaryUseCase(
  id: string,
  useCase: UpdatePrimaryUseCaseDto,
): Promise<UseCaseDetailDto> {
  return http.put(primaryUseCaseEndpoints.detail, { body: useCase, pathParams: { id } });
}

export const useCaseClient = {
  listProjectUseCases,
  createPrimaryUseCase,
  updatePrimaryUseCase,
};

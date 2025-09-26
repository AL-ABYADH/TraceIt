import { http } from "@/services/api/http";
import { primaryUseCaseEndpoints } from "../use-case-endpoints";
import {
  CreatePrimaryUseCaseDto,
  UpdatePrimaryUseCaseDto,
  PrimaryUseCaseDetailDto,
  PrimaryUseCaseListDto,
} from "@repo/shared-schemas";

async function listPrimaryUseCases(projectId: string): Promise<PrimaryUseCaseListDto[]> {
  return http.get(primaryUseCaseEndpoints.list, { params: { projectId } });
}

async function createPrimaryUseCase(
  useCase: CreatePrimaryUseCaseDto,
): Promise<PrimaryUseCaseDetailDto> {
  return http.post(primaryUseCaseEndpoints.list, { body: useCase });
}

async function updatePrimaryUseCase(
  id: string,
  useCase: UpdatePrimaryUseCaseDto,
): Promise<PrimaryUseCaseDetailDto> {
  return http.put(primaryUseCaseEndpoints.detail, { body: useCase, pathParams: { id } });
}

async function removePrimaryUseCase(id: string) {
  return http.del(primaryUseCaseEndpoints.detail, { pathParams: { id } });
}

export const primaryUseCaseClient = {
  createPrimaryUseCase,
  updatePrimaryUseCase,
  removePrimaryUseCase,
  listPrimaryUseCases,
};

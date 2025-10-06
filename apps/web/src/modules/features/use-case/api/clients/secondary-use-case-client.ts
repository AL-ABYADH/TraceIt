import { http } from "@/services/api/http";
import {
  CreateSecondaryUseCaseDto,
  SecondaryUseCaseDetailDto,
  SecondaryUseCaseListDto,
  UpdateSecondaryUseCaseDto,
} from "@repo/shared-schemas";
import { secondaryUseCaseEndpoints } from "../use-case-endpoints";

async function listSecondaryUseCases(projectId: string): Promise<SecondaryUseCaseListDto[]> {
  return http.get(secondaryUseCaseEndpoints.list, { params: { projectId } });
}

async function createSecondaryUseCase(
  useCase: CreateSecondaryUseCaseDto,
): Promise<SecondaryUseCaseListDto> {
  return http.post(secondaryUseCaseEndpoints.list, { body: useCase });
}

async function getSecondaryUseCase(id: string): Promise<SecondaryUseCaseDetailDto> {
  return http.get(secondaryUseCaseEndpoints.detail, { pathParams: { id } });
}

async function updateSecondaryUseCase(
  id: string,
  useCase: UpdateSecondaryUseCaseDto,
): Promise<SecondaryUseCaseDetailDto> {
  return http.put(secondaryUseCaseEndpoints.detail, { body: useCase, pathParams: { id } });
}

async function removeSecondaryUseCase(id: string) {
  return http.del(secondaryUseCaseEndpoints.detail, { pathParams: { id } });
}

export const secondaryUseCaseClient = {
  listSecondaryUseCases,
  createSecondaryUseCase,
  getSecondaryUseCase,
  updateSecondaryUseCase,
  removeSecondaryUseCase,
};

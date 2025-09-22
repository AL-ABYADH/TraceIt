import { http } from "@/services/api/http";
import { primaryUseCaseEndpoints, useCaseEndpoints } from "../use-case-endpoints";
import {
  CreatePrimaryUseCaseDto,
  UpdatePrimaryUseCaseDto,
  UseCaseDetailDto,
} from "@repo/shared-schemas";

async function createPrimaryUseCase(useCase: CreatePrimaryUseCaseDto): Promise<UseCaseDetailDto> {
  return http.post(primaryUseCaseEndpoints.list, { body: useCase });
}

async function updatePrimaryUseCase(
  id: string,
  useCase: UpdatePrimaryUseCaseDto,
): Promise<UseCaseDetailDto> {
  return http.put(primaryUseCaseEndpoints.detail, { body: useCase, pathParams: { id } });
}

async function removePrimaryUseCase(id: string) {
  return http.del(primaryUseCaseEndpoints.detail, { pathParams: { id } });
}

export const primaryUseCaseClient = {
  createPrimaryUseCase,
  updatePrimaryUseCase,
  removePrimaryUseCase,
};

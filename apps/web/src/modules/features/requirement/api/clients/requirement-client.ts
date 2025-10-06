import { http } from "@/services/api/http";
import {
  CreateRequirementDto,
  RequirementDetailDto,
  RequirementDto,
  UpdateRequirementDto,
} from "@repo/shared-schemas";
import { requirementEndpoints, useCaseRequirementsEndpoints } from "../requirement-endpoints";

async function listUseCaseRequirements(useCaseId: string): Promise<RequirementDto[]> {
  return http.get(useCaseRequirementsEndpoints.list, { pathParams: { useCaseId } });
}

async function createRequirement(requirement: CreateRequirementDto): Promise<RequirementDetailDto> {
  return http.post(requirementEndpoints.list, { body: requirement });
}

async function getRequirement(id: string): Promise<RequirementDetailDto> {
  return http.get(requirementEndpoints.detail, { pathParams: { id } });
}

async function removeRequirement(id: string): Promise<boolean> {
  return http.del(requirementEndpoints.detail, { pathParams: { id } });
}

async function updateRequirement(
  id: string,
  payload: UpdateRequirementDto,
): Promise<RequirementDetailDto> {
  return http.put(requirementEndpoints.detail, { pathParams: { id }, body: payload });
}

export const requirementClient = {
  createRequirement,
  listUseCaseRequirements,
  getRequirement,
  updateRequirement,
  removeRequirement,
};

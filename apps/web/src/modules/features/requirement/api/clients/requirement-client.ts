import { http } from "@/services/api/http";
import {
  CreateRequirementDto,
  RequirementDetailDto,
  RequirementDto,
  UpdateRequirementDto,
  RequirementIdDto,
  RequirementRelationshipStatusDto,
  RequirementListDto,
} from "@repo/shared-schemas";
import { requirementEndpoints, useCaseRequirementsEndpoints } from "../requirement-endpoints";

async function listUseCaseRequirements(useCaseId: string): Promise<RequirementDto[]> {
  return http.get(useCaseRequirementsEndpoints.list, { pathParams: { useCaseId } });
}
async function listAllRequirementsUnderUseCase(useCaseId: string): Promise<RequirementListDto[]> {
  return http.get(useCaseRequirementsEndpoints.allRequirements, { pathParams: { useCaseId } });
}

async function createRequirement(requirement: CreateRequirementDto): Promise<RequirementDetailDto> {
  return http.post(requirementEndpoints.list, { body: requirement });
}
async function getRequirementRelationships({
  requirementId,
}: RequirementIdDto): Promise<RequirementRelationshipStatusDto> {
  return http.get(requirementEndpoints.relationships, {
    pathParams: { requirementId },
  });
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
  listAllRequirementsUnderUseCase,
  getRequirement,
  updateRequirement,
  removeRequirement,
  getRequirementRelationships,
};

import { http } from "@/services/api/http";
import {
  CreateRequirementDto,
  RequirementDetailDto,
  RequirementDto,
  RequirementIdDto,
  RequirementRelationshipStatusDto,
} from "@repo/shared-schemas";
import { requirementEndpoints, useCaseRequirementsEndpoints } from "../requirement-endpoints";

async function listUseCaseRequirements(useCaseId: string): Promise<RequirementDto[]> {
  return http.get(useCaseRequirementsEndpoints.list, { pathParams: { useCaseId } });
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

export const requirementClient = {
  createRequirement,
  listUseCaseRequirements,
  getRequirementRelationships,
};

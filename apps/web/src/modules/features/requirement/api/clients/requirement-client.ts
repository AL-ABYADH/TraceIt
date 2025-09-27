import { http } from "@/services/api/http";
import {
  CreateRequirementDto,
  RequirementDetailDto,
  RequirementListDto,
} from "@repo/shared-schemas";
import { requirementEndpoints, useCaseRequirementsEndpoints } from "../requirement-endpoints";

async function listUseCaseRequirements(useCaseId: string): Promise<RequirementListDto[]> {
  return http.get(useCaseRequirementsEndpoints.list, { pathParams: { useCaseId } });
}

async function createRequirement(requirement: CreateRequirementDto): Promise<RequirementDetailDto> {
  return http.post(requirementEndpoints.list, { body: requirement });
}

export const requirementClient = {
  createRequirement,
  listUseCaseRequirements,
};

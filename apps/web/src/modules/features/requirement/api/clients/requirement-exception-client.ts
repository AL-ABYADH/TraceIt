import { http } from "@/services/api/http";
import {
  CreateRequirementExceptionDto,
  RequirementExceptionDetailDto,
  RequirementExceptionListDto,
} from "@repo/shared-schemas";
import { requirementExceptionEndpoints } from "../requirement-endpoints";

async function createRequirementException(
  requirementException: CreateRequirementExceptionDto,
): Promise<RequirementExceptionListDto> {
  return http.post(requirementExceptionEndpoints.list, { body: requirementException });
}

async function getRequirementException(id: string): Promise<RequirementExceptionDetailDto> {
  return http.get(requirementExceptionEndpoints.detail, { pathParams: { id } });
}

export const requirementClient = {
  createRequirementException,
  getRequirementException,
};

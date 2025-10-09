import { http } from "@/services/api/http";
import {
  CreateRequirementExceptionDto,
  RequirementExceptionDetailDto,
  RequirementExceptionListDto,
  UpdateRequirementExceptionDto,
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

async function removeRequirementException(id: string): Promise<boolean> {
  return http.del(requirementExceptionEndpoints.detail, { pathParams: { id } });
}

async function updateRequirementException(
  id: string,
  payload: UpdateRequirementExceptionDto,
): Promise<RequirementExceptionListDto> {
  return http.put(requirementExceptionEndpoints.detail, { pathParams: { id }, body: payload });
}

export const requirementExceptionClient = {
  createRequirementException,
  getRequirementException,
  removeRequirementException,
  updateRequirementException,
};

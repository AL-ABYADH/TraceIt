import { http } from "@/services/api/http";
import { CreateRequirementExceptionDto, RequirementExceptionListDto } from "@repo/shared-schemas";
import { requirementExceptionEndpoints } from "../requirement-endpoints";

async function createRequirementException(
  requirementException: CreateRequirementExceptionDto,
): Promise<RequirementExceptionListDto> {
  return http.post(requirementExceptionEndpoints.list, { body: requirementException });
}

export const requirementClient = {
  createRequirementException,
};

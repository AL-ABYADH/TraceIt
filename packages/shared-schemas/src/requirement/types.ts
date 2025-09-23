import { z } from "../zod-openapi-init";
import {
  createRequirementExceptionSchema,
  createRequirementSchema,
  updateRequirementExceptionSchema,
  updateRequirementSchema,
  useCaseIdSchema,
} from "./schemas";

export type UseCaseIdDto = z.infer<typeof useCaseIdSchema>;
export type CreateRequirementDto = z.infer<typeof createRequirementSchema>;
export type CreateRequirementExceptionDto = z.infer<
  typeof createRequirementExceptionSchema
>;

export type UpdateRequirementDto = z.infer<typeof updateRequirementSchema>;

export type UpdateRequirementExceptionDto = z.infer<
  typeof updateRequirementExceptionSchema
>;

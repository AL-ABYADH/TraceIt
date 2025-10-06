import { actorSchema } from "../actor";
import { useCaseDetailSchema } from "../use-case";
import { z } from "../zod-openapi-init";
import {
  childIdSchema,
  createRequirementExceptionSchema,
  createRequirementSchema,
  exceptionIdSchema,
  requirementDetailSchema,
  requirementExceptionDetailSchema,
  requirementExceptionIdSchema,
  requirementExceptionListSchema,
  requirementIdSchema,
  requirementListSchema,
  requirementOptionalIdSchema,
  requirementRelationshipStatusSchema,
  updateRequirementExceptionSchema,
  updateRequirementSchema,
  useCaseIdSchema,
} from "./schemas";

export type UseCaseIdDto = z.infer<typeof useCaseIdSchema>;
export type CreateRequirementDto = z.infer<typeof createRequirementSchema>;
export type CreateRequirementExceptionDto = z.infer<typeof createRequirementExceptionSchema>;

export type UpdateRequirementDto = z.infer<typeof updateRequirementSchema>;

export type UpdateRequirementExceptionDto = z.infer<typeof updateRequirementExceptionSchema>;
export type RequirementDetailDto = z.infer<typeof requirementDetailSchema>;
export type RequirementListDto = z.infer<typeof requirementListSchema>;
export type RequirementExceptionDetailDto = z.infer<typeof requirementExceptionDetailSchema>;
export type RequirementExceptionListDto = z.infer<typeof requirementExceptionListSchema>;

export type RequirementIdDto = z.infer<typeof requirementIdSchema>;
export type RequirementOptionalIdDto = z.infer<typeof requirementOptionalIdSchema>;
export type RequirementExceptionIdDto = z.infer<typeof requirementExceptionIdSchema>;

export type ExceptionIdDto = z.infer<typeof exceptionIdSchema>;

export type ChildIdDto = z.infer<typeof childIdSchema>;

export type RequirementDto = z.infer<typeof requirementListSchema> & {
  useCase: z.infer<typeof useCaseDetailSchema>;
  actors?: z.infer<typeof actorSchema>[];
  nestedRequirements?: RequirementDto[];
  exceptions?: RequirementExceptionDto[];
};

export type RequirementExceptionRelationshipsDto = {
  requirements: z.infer<typeof requirementDetailSchema>[];
};

export type RequirementExceptionDto = RequirementExceptionListDto &
  RequirementExceptionRelationshipsDto;

export type RequirementRelationshipStatusDto = z.infer<typeof requirementRelationshipStatusSchema>;

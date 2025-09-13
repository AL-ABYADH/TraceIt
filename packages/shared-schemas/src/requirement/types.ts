import { z } from "../zod-openapi-init";
import {
  useCaseIdSchema,
  requirementTypeSchema,
  createSystemRequirementSchema,
  createEventSystemRequirementSchema,
  createActorRequirementSchema,
  createSystemActorCommunicationRequirementSchema,
  createConditionalRequirementSchema,
  createRecursiveRequirementSchema,
  createUseCaseReferenceRequirementSchema,
  createLogicalGroupRequirementSchema,
  createConditionalGroupRequirementSchema,
  createSimultaneousRequirementSchema,
  createExceptionalRequirementSchema,
  updateSystemRequirementSchema,
  updateEventSystemRequirementSchema,
  updateActorRequirementSchema,
  updateSystemActorCommunicationRequirementSchema,
  updateConditionalRequirementSchema,
  updateRecursiveRequirementSchema,
  updateUseCaseReferenceRequirementSchema,
  updateLogicalGroupRequirementSchema,
  updateConditionalGroupRequirementSchema,
  updateSimultaneousRequirementSchema,
  updateExceptionalRequirementSchema,
  requirementIdSchema,
} from "./schemas";

// Query types
export type UseCaseIdDto = z.infer<typeof useCaseIdSchema>;
export type RequirementTypeDto = z.infer<typeof requirementTypeSchema>;
export type requirementIdDto = z.infer<typeof requirementIdSchema>;

// Create DTOs - Simple Requirements
export type CreateSystemRequirementDto = z.infer<
  typeof createSystemRequirementSchema
>;
export type CreateEventSystemRequirementDto = z.infer<
  typeof createEventSystemRequirementSchema
>;
export type CreateActorRequirementDto = z.infer<
  typeof createActorRequirementSchema
>;
export type CreateSystemActorCommunicationRequirementDto = z.infer<
  typeof createSystemActorCommunicationRequirementSchema
>;
export type CreateConditionalRequirementDto = z.infer<
  typeof createConditionalRequirementSchema
>;
export type CreateRecursiveRequirementDto = z.infer<
  typeof createRecursiveRequirementSchema
>;
export type CreateUseCaseReferenceRequirementDto = z.infer<
  typeof createUseCaseReferenceRequirementSchema
>;

// Create DTOs - Composite Requirements
export type CreateLogicalGroupRequirementDto = z.infer<
  typeof createLogicalGroupRequirementSchema
>;
export type CreateConditionalGroupRequirementDto = z.infer<
  typeof createConditionalGroupRequirementSchema
>;
export type CreateSimultaneousRequirementDto = z.infer<
  typeof createSimultaneousRequirementSchema
>;
export type CreateExceptionalRequirementDto = z.infer<
  typeof createExceptionalRequirementSchema
>;

// Update DTOs - Simple Requirements
export type UpdateSystemRequirementDto = z.infer<
  typeof updateSystemRequirementSchema
>;
export type UpdateEventSystemRequirementDto = z.infer<
  typeof updateEventSystemRequirementSchema
>;
export type UpdateActorRequirementDto = z.infer<
  typeof updateActorRequirementSchema
>;
export type UpdateSystemActorCommunicationRequirementDto = z.infer<
  typeof updateSystemActorCommunicationRequirementSchema
>;
export type UpdateConditionalRequirementDto = z.infer<
  typeof updateConditionalRequirementSchema
>;
export type UpdateRecursiveRequirementDto = z.infer<
  typeof updateRecursiveRequirementSchema
>;
export type UpdateUseCaseReferenceRequirementDto = z.infer<
  typeof updateUseCaseReferenceRequirementSchema
>;

// Update DTOs - Composite Requirements
export type UpdateLogicalGroupRequirementDto = z.infer<
  typeof updateLogicalGroupRequirementSchema
>;
export type UpdateConditionalGroupRequirementDto = z.infer<
  typeof updateConditionalGroupRequirementSchema
>;
export type UpdateSimultaneousRequirementDto = z.infer<
  typeof updateSimultaneousRequirementSchema
>;
export type UpdateExceptionalRequirementDto = z.infer<
  typeof updateExceptionalRequirementSchema
>;

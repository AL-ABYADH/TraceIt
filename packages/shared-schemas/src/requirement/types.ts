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
  requirementListSchema,
  requirementDetailSchema,
  systemRequirementListSchema,
  systemRequirementDetailSchema,
  eventSystemRequirementDetailSchema,
  eventSystemRequirementListSchema,
  actorRequirementDetailSchema,
  actorRequirementListSchema,
  systemActorCommunicationRequirementDetailSchema,
  systemActorCommunicationRequirementListSchema,
  conditionalRequirementDetailSchema,
  conditionalRequirementListSchema,
  recursiveRequirementDetailSchema,
  recursiveRequirementListSchema,
  useCaseReferenceRequirementDetailSchema,
  useCaseReferenceRequirementListSchema,
  logicalGroupRequirementDetailSchema,
  logicalGroupRequirementListSchema,
  conditionalGroupRequirementDetailSchema,
  conditionalGroupRequirementListSchema,
  simultaneousRequirementDetailSchema,
  simultaneousRequirementListSchema,
  exceptionalRequirementDetailSchema,
  exceptionalRequirementListSchema,
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
export type RequirementListDto = z.infer<typeof requirementListSchema>;
export type RequirementDetailDto = z.infer<typeof requirementDetailSchema>;
export type SystemRequirementListDto = z.infer<
  typeof systemRequirementListSchema
>;
export type SystemRequirementDetailDto = z.infer<
  typeof systemRequirementDetailSchema
>;
export type EventSystemRequirementDetailDto = z.infer<
  typeof eventSystemRequirementDetailSchema
>;
export type EventSystemRequirementListDto = z.infer<
  typeof eventSystemRequirementListSchema
>;
export type ActorRequirementDetailDto = z.infer<
  typeof actorRequirementDetailSchema
>;
export type ActorRequirementListDto = z.infer<
  typeof actorRequirementListSchema
>;
export type SystemActorCommunicationRequirementDetailDto = z.infer<
  typeof systemActorCommunicationRequirementDetailSchema
>;
export type SystemActorCommunicationRequirementListDto = z.infer<
  typeof systemActorCommunicationRequirementListSchema
>;

// ConditionalRequirement DTOs
export type ConditionalRequirementDetailDto = z.infer<
  typeof conditionalRequirementDetailSchema
>;

export type ConditionalRequirementListDto = z.infer<
  typeof conditionalRequirementListSchema
>;

export type RecursiveRequirementDetailDto = z.infer<
  typeof recursiveRequirementDetailSchema
>;

export type RecursiveRequirementListDto = z.infer<
  typeof recursiveRequirementListSchema
>;

// DTOs
export type UseCaseReferenceRequirementDetailDto = z.infer<
  typeof useCaseReferenceRequirementDetailSchema
>;

export type UseCaseReferenceRequirementListDto = z.infer<
  typeof useCaseReferenceRequirementListSchema
>;

export type LogicalGroupRequirementDetailDto = z.infer<
  typeof logicalGroupRequirementDetailSchema
>;

export type LogicalGroupRequirementListDto = z.infer<
  typeof logicalGroupRequirementListSchema
>;

export type ConditionalGroupRequirementDetailDto = z.infer<
  typeof conditionalGroupRequirementDetailSchema
>;
export type ConditionalGroupRequirementListDto = z.infer<
  typeof conditionalGroupRequirementListSchema
>;

export type SimultaneousRequirementDetailDto = z.infer<
  typeof simultaneousRequirementDetailSchema
>;
export type SimultaneousRequirementListDto = z.infer<
  typeof simultaneousRequirementListSchema
>;

export type ExceptionalRequirementDetailDto = z.infer<
  typeof exceptionalRequirementDetailSchema
>;
export type ExceptionalRequirementListDto = z.infer<
  typeof exceptionalRequirementListSchema
>;

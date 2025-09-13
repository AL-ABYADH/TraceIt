import { z } from "../zod-openapi-init";
import {
  useCaseIdFieldDoc,
  depthFieldDoc,
  operationFieldDoc,
  conditionFieldDoc,
  eventActorIdFieldDoc,
  actorIdsFieldDoc,
  communicationInfoFieldDoc,
  communicationFacilityFieldDoc,
  requirementIdFieldDoc,
  referencedUseCaseIdFieldDoc,
  mainRequirementIdFieldDoc,
  detailRequirementIdsFieldDoc,
  conditionalValueFieldDoc,
  primaryConditionIdFieldDoc,
  alternativeConditionIdsFieldDoc,
  fallbackConditionIdFieldDoc,
  simpleRequirementIdsFieldDoc,
  exceptionalFieldDoc,
  exceptionRequirementIdsFieldDoc,
  requirementTypeEnumDoc,
} from "./openapi-fields";
import { projectIdFieldDoc } from "../use-case";

/**
 * =========================
 * QUERY SCHEMAS
 * =========================
 */

export const useCaseIdSchema = z
  .object({
    useCaseId: useCaseIdFieldDoc,
  })
  .openapi({ title: "UseCaseIdDto" });

export const requirementTypeSchema = z
  .object({
    type: requirementTypeEnumDoc,
  })
  .openapi({ title: "RequirementTypeDto" });

/**
 * =========================
 * CREATE SCHEMAS - SIMPLE REQUIREMENTS
 * =========================
 */

// System Requirement
export const createSystemRequirementSchema = z
  .object({
    useCaseId: useCaseIdFieldDoc,
    projectId: projectIdFieldDoc,
    depth: depthFieldDoc,
    operation: operationFieldDoc,
  })
  .openapi({ title: "CreateSystemRequirementDto" });

// Event System Requirement
export const createEventSystemRequirementSchema = z
  .object({
    useCaseId: useCaseIdFieldDoc,
    projectId: projectIdFieldDoc,
    depth: depthFieldDoc,
    operation: operationFieldDoc,
    eventActorId: eventActorIdFieldDoc,
  })
  .openapi({ title: "CreateEventSystemRequirementDto" });

// Actor Requirement
export const createActorRequirementSchema = z
  .object({
    useCaseId: useCaseIdFieldDoc,
    projectId: projectIdFieldDoc,
    depth: depthFieldDoc,
    operation: operationFieldDoc,
    actorIds: actorIdsFieldDoc,
  })
  .openapi({ title: "CreateActorRequirementDto" });

// System Actor Communication Requirement
export const createSystemActorCommunicationRequirementSchema = z
  .object({
    useCaseId: useCaseIdFieldDoc,
    projectId: projectIdFieldDoc,
    depth: depthFieldDoc,
    communicationInfo: communicationInfoFieldDoc,
    communicationFacility: communicationFacilityFieldDoc,
    actorIds: actorIdsFieldDoc,
  })
  .openapi({ title: "CreateSystemActorCommunicationRequirementDto" });

// Conditional Requirement
export const createConditionalRequirementSchema = z
  .object({
    useCaseId: useCaseIdFieldDoc,
    projectId: projectIdFieldDoc,
    depth: depthFieldDoc,
    condition: conditionFieldDoc,
    requirementId: requirementIdFieldDoc,
  })
  .openapi({ title: "CreateConditionalRequirementDto" });

// Recursive Requirement
export const createRecursiveRequirementSchema = z
  .object({
    useCaseId: useCaseIdFieldDoc,
    projectId: projectIdFieldDoc,
    depth: depthFieldDoc,
    requirementId: requirementIdFieldDoc,
  })
  .openapi({ title: "CreateRecursiveRequirementDto" });

// Use Case Reference Requirement
export const createUseCaseReferenceRequirementSchema = z
  .object({
    useCaseId: useCaseIdFieldDoc,
    projectId: projectIdFieldDoc,
    depth: depthFieldDoc,
    referencedUseCaseId: referencedUseCaseIdFieldDoc,
  })
  .openapi({ title: "CreateUseCaseReferenceRequirementDto" });

/**
 * =========================
 * CREATE SCHEMAS - COMPOSITE REQUIREMENTS
 * =========================
 */

// Logical Group Requirement
export const createLogicalGroupRequirementSchema = z
  .object({
    useCaseId: useCaseIdFieldDoc,
    projectId: projectIdFieldDoc,
    depth: depthFieldDoc,
    mainRequirementId: mainRequirementIdFieldDoc,
    detailRequirementIds: detailRequirementIdsFieldDoc,
  })
  .openapi({ title: "CreateLogicalGroupRequirementDto" });

// Conditional Group Requirement
export const createConditionalGroupRequirementSchema = z
  .object({
    useCaseId: useCaseIdFieldDoc,
    projectId: projectIdFieldDoc,
    depth: depthFieldDoc,
    conditionalValue: conditionalValueFieldDoc,
    primaryConditionId: primaryConditionIdFieldDoc,
    alternativeConditionIds: alternativeConditionIdsFieldDoc,
    fallbackConditionId: fallbackConditionIdFieldDoc.optional(),
  })
  .openapi({ title: "CreateConditionalGroupRequirementDto" });

// Simultaneous Requirement
export const createSimultaneousRequirementSchema = z
  .object({
    useCaseId: useCaseIdFieldDoc,
    projectId: projectIdFieldDoc,
    depth: depthFieldDoc,
    simpleRequirementIds: simpleRequirementIdsFieldDoc,
  })
  .openapi({ title: "CreateSimultaneousRequirementDto" });

// Exceptional Requirement
export const createExceptionalRequirementSchema = z
  .object({
    useCaseId: useCaseIdFieldDoc,
    projectId: projectIdFieldDoc,
    depth: depthFieldDoc,
    exception: exceptionalFieldDoc,
    requirementIds: exceptionRequirementIdsFieldDoc,
  })
  .openapi({ title: "CreateExceptionalRequirementDto" });

/**
 * =========================
 * UPDATE SCHEMAS - SIMPLE REQUIREMENTS
 * =========================
 */

// System Requirement
export const updateSystemRequirementSchema = z
  .object({
    depth: depthFieldDoc.optional(),
    operation: operationFieldDoc.optional(),
  })
  .openapi({ title: "UpdateSystemRequirementDto" });

// Event System Requirement
export const updateEventSystemRequirementSchema = z
  .object({
    depth: depthFieldDoc.optional(),
    operation: operationFieldDoc.optional(),
    eventActorId: eventActorIdFieldDoc.optional(),
  })
  .openapi({ title: "UpdateEventSystemRequirementDto" });

// Actor Requirement
export const updateActorRequirementSchema = z
  .object({
    depth: depthFieldDoc.optional(),
    operation: operationFieldDoc.optional(),
    actorIds: actorIdsFieldDoc.optional(),
  })
  .openapi({ title: "UpdateActorRequirementDto" });

// System Actor Communication Requirement
export const updateSystemActorCommunicationRequirementSchema = z
  .object({
    depth: depthFieldDoc.optional(),
    communicationInfo: communicationInfoFieldDoc.optional(),
    communicationFacility: communicationFacilityFieldDoc.optional(),
    actorIds: actorIdsFieldDoc.optional(),
  })
  .openapi({ title: "UpdateSystemActorCommunicationRequirementDto" });

// Conditional Requirement
export const updateConditionalRequirementSchema = z
  .object({
    depth: depthFieldDoc.optional(),
    condition: conditionFieldDoc.optional(),
    requirementId: requirementIdFieldDoc.optional(),
  })
  .openapi({ title: "UpdateConditionalRequirementDto" });

// Recursive Requirement
export const updateRecursiveRequirementSchema = z
  .object({
    depth: depthFieldDoc.optional(),
    requirementId: requirementIdFieldDoc.optional(),
  })
  .openapi({ title: "UpdateRecursiveRequirementDto" });

// Use Case Reference Requirement
export const updateUseCaseReferenceRequirementSchema = z
  .object({
    depth: depthFieldDoc.optional(),
    referencedUseCaseId: referencedUseCaseIdFieldDoc.optional(),
  })
  .openapi({ title: "UpdateUseCaseReferenceRequirementDto" });

/**
 * =========================
 * UPDATE SCHEMAS - COMPOSITE REQUIREMENTS
 * =========================
 */

// Logical Group Requirement
export const updateLogicalGroupRequirementSchema = z
  .object({
    depth: depthFieldDoc.optional(),
    mainRequirementId: mainRequirementIdFieldDoc.optional(),
    detailRequirementIds: detailRequirementIdsFieldDoc.optional(),
  })
  .openapi({ title: "UpdateLogicalGroupRequirementDto" });

// Conditional Group Requirement
export const updateConditionalGroupRequirementSchema = z
  .object({
    depth: depthFieldDoc.optional(),
    conditionalValue: conditionalValueFieldDoc.optional(),
    primaryConditionId: primaryConditionIdFieldDoc.optional(),
    alternativeConditionIds: alternativeConditionIdsFieldDoc.optional(),
    fallbackConditionId: fallbackConditionIdFieldDoc.optional(),
  })
  .openapi({ title: "UpdateConditionalGroupRequirementDto" });

// Simultaneous Requirement
export const updateSimultaneousRequirementSchema = z
  .object({
    depth: depthFieldDoc.optional(),
    simpleRequirementIds: simpleRequirementIdsFieldDoc.optional(),
  })
  .openapi({ title: "UpdateSimultaneousRequirementDto" });

// Exceptional Requirement
export const updateExceptionalRequirementSchema = z
  .object({
    depth: depthFieldDoc.optional(),
    exception: exceptionalFieldDoc.optional(),
    requirementIds: exceptionRequirementIdsFieldDoc.optional(),
  })
  .openapi({ title: "UpdateExceptionalRequirementDto" });

export const requirementIdSchema = z.object({
  requirementId: requirementIdFieldDoc,
});

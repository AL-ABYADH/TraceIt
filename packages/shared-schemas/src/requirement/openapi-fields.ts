import {
  RequirementTypeEnum,
  depthField,
  operationField,
  conditionField,
  exceptionalField,
  communicationInfoField,
  communicationFacilityField,
  conditionalValueField,
  actorIdsField,
  requirementIdsField,
  useCaseIdField,
  RequirementType,
} from "./fields";
import { requirementIdField, uuidField } from "../common";

export const useCaseIdFieldDoc = useCaseIdField.openapi({
  description: "UUID of the use case this requirement belongs to",
  example: "b2c3d4e5-f6a7-8901-bcde-f1234567890a",
});

export const referencedUseCaseIdFieldDoc = useCaseIdField.openapi({
  description: "UUID of the use case being referenced",
  example: "c3d4e5f6-7a8b-9012-cdef-123456789abc",
});

// Common requirement fields
export const requirementTypeEnumDoc = RequirementTypeEnum.openapi({
  description: "Type of the requirement",
  example: RequirementType.ACTOR_REQUIREMENT,
});

export const depthFieldDoc = depthField.openapi({
  description: "Depth level in the requirements hierarchy",
  example: 0,
});

// Simple requirement fields
export const operationFieldDoc = operationField.openapi({
  description: "Operation performed by the system or actor",
  example: "validate user credentials",
});

export const conditionFieldDoc = conditionField.openapi({
  description: "Condition that triggers the requirement",
  example: "user is not authenticated",
});

export const eventActorIdFieldDoc = uuidField.openapi({
  description: "UUID of the event actor triggering the system operation",
  example: "d4e5f6a7-8b90-12cd-ef12-3456789abcde",
});

export const actorIdsFieldDoc = actorIdsField.openapi({
  description: "UUIDs of actors involved in the requirement",
  example: ["e5f6a7b8-9012-cdef-1234-56789abcdef0"],
});

export const communicationInfoFieldDoc = communicationInfoField.openapi({
  description: "Information being communicated to the actor",
  example: "user authentication status",
});

export const communicationFacilityFieldDoc = communicationFacilityField.openapi(
  {
    description: "Facility used for communication (email, notification, etc.)",
    example: "notification",
  },
);

// Composite requirement fields
export const conditionalValueFieldDoc = conditionalValueField.openapi({
  description: "Noun phrase describing the conditional value",
  example: "authentication method",
});

export const mainRequirementIdFieldDoc = requirementIdField.openapi({
  description: "UUID of the main requirement in a logical group",
  example: "a7b8c9d0-1234-5678-9abc-def0123456789",
});

export const detailRequirementIdsFieldDoc = requirementIdsField.openapi({
  description: "UUIDs of the detail requirements in a logical group",
  example: [
    "b8c9d0e1-2345-6789-abcd-ef01234567890",
    "c9d0e1f2-3456-789a-bcde-f012345678901",
  ],
});

export const primaryConditionIdFieldDoc = requirementIdField.openapi({
  description: "UUID of the primary condition in a conditional group",
  example: "d0e1f2a3-4567-89ab-cdef-0123456789012",
});

export const alternativeConditionIdsFieldDoc = requirementIdsField.openapi({
  description: "UUIDs of alternative conditions in a conditional group",
  example: ["e1f2a3b4-5678-9abc-def0-123456789012"],
});

export const fallbackConditionIdFieldDoc = requirementIdField.openapi({
  description: "UUID of the fallback condition in a conditional group",
  example: "f2a3b4c5-6789-abcd-ef01-2345678901234",
});

export const simpleRequirementIdsFieldDoc = requirementIdsField.openapi({
  description: "UUIDs of simple requirements to be executed simultaneously",
  example: [
    "a3b4c5d6-789a-bcde-f012-3456789012345",
    "b4c5d6e7-89ab-cdef-0123-456789012345",
  ],
});

export const exceptionalFieldDoc = exceptionalField.openapi({
  description: "Description of the exception condition",
  example: "network connection lost",
});

export const exceptionRequirementIdsFieldDoc = requirementIdsField.openapi({
  description: "UUIDs of requirements to handle the exception",
  example: ["c5d6e7f8-9abc-def0-1234-56789012345"],
});

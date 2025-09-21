import { createEnumField, createField } from "../common/field-factory";
import { uuidField } from "../common";

// Requirement enums
// export const requirementTypeEnum = createEnumField([
//   "SYSTEM_REQUIREMENT",
//   "EVENT_SYSTEM_REQUIREMENT",
//   "ACTOR_REQUIREMENT",
//   "SYSTEM_ACTOR_COMMUNICATION_REQUIREMENT",
//   "CONDITIONAL_REQUIREMENT",
//   "RECURSIVE_REQUIREMENT",
//   "USE_CASE_REFERENCE_REQUIREMENT",
//   "LOGICAL_GROUP_REQUIREMENT",
//   "CONDITIONAL_GROUP_REQUIREMENT",
//   "SIMULTANEOUS_REQUIREMENT",
//   "EXCEPTIONAL_REQUIREMENT",
// ]);
export enum RequirementType {
  SYSTEM_REQUIREMENT = "SYSTEM_REQUIREMENT",
  EVENT_SYSTEM_REQUIREMENT = "EVENT_SYSTEM_REQUIREMENT",
  ACTOR_REQUIREMENT = "ACTOR_REQUIREMENT",
  SYSTEM_ACTOR_COMMUNICATION_REQUIREMENT = "SYSTEM_ACTOR_COMMUNICATION_REQUIREMENT",
  CONDITIONAL_REQUIREMENT = "CONDITIONAL_REQUIREMENT",
  RECURSIVE_REQUIREMENT = "RECURSIVE_REQUIREMENT",
  USE_CASE_REFERENCE_REQUIREMENT = "USE_CASE_REFERENCE_REQUIREMENT",
  LOGICAL_GROUP_REQUIREMENT = "LOGICAL_GROUP_REQUIREMENT",
  CONDITIONAL_GROUP_REQUIREMENT = "CONDITIONAL_GROUP_REQUIREMENT",
  SIMULTANEOUS_REQUIREMENT = "SIMULTANEOUS_REQUIREMENT",
  EXCEPTIONAL_REQUIREMENT = "EXCEPTIONAL_REQUIREMENT",
}
export const RequirementTypeEnum = createEnumField(RequirementType);

// Common requirement fields
export const depthField = createField("number", {
  min: 0,
  description: "Depth of the requirement in the tree structure",
});

export const operationField = createField("string", {
  min: 1,
  max: 100,
  regex: /^[A-Za-z].+/,
  message: "Operation must be a verb phrase and not exceed 100 characters",
});

export const conditionField = createField("string", {
  min: 1,
  max: 50,
  message: "Condition must not exceed 50 characters",
});

export const exceptionalField = createField("string", {
  min: 1,
  max: 100,
  message: "Exception must not exceed 100 characters",
});

export const communicationInfoField = createField("string", {
  min: 1,
  max: 200,
  message: "Communication info must not exceed 200 characters",
});

export const communicationFacilityField = createField("string", {
  min: 1,
  max: 200,
  message: "Communication facility must not exceed 200 characters",
});

export const conditionalValueField = createField("string", {
  min: 1,
  max: 50,
  message:
    "Conditional value must be a noun phrase and not exceed 50 characters",
});

// Fields for relationships
export const actorIdsField = createField("array", {
  elementType: uuidField,
  description: "Array of actor IDs involved in the requirement",
});

export const requirementIdField = uuidField;

export const requirementIdsField = createField("array", {
  elementType: uuidField,
  description: "Array of requirement IDs",
});

export const useCaseIdField = uuidField;

/**
 * Event Actor specialization (only subtype = "event")
 */
// export const eventActorSchema = actorSchema
//   .extend({
//     subtype: actorSubTypeEnumDoc.openapi({
//       example: "event",
//       description: "Subtype must always be 'event' for event actors",
//     }),
//   })
//   .refine((data) => data.subtype === "event", {
//     message: "Actor subtype must be 'event'",
//   });

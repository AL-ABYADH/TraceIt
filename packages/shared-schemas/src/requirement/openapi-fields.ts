import {
  actorIdsField,
  conditionField,
  operationField,
  useCaseIdField,
} from "./fields";

export const useCaseIdFieldDoc = useCaseIdField.openapi({
  description: "UUID of the use case this requirement belongs to",
  example: "b2c3d4e5-f6a7-8901-bcde-f1234567890a",
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

export const actorIdsFieldDoc = actorIdsField.openapi({
  description: "UUIDs of actors involved in the requirement",
  example: ["e5f6a7b8-9012-cdef-1234-56789abcdef0"],
});

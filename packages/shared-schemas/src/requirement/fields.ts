import { createField, uuidField } from "../common";

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

// Fields for relationships
export const actorIdsField = createField("array", {
  elementType: uuidField,
  description: "Array of actor IDs involved in the requirement",
});

export const requirementIdsField = createField("array", {
  elementType: uuidField,
  description: "Array of requirement IDs",
});

export const useCaseIdField = uuidField;

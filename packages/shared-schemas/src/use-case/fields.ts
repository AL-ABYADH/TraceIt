import { createEnumField, createField, uuidField } from "../common";

export enum UseCaseImportanceLevel {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

export enum UseCaseSubtype {
  PRIMARY = "PRIMARY",
  SECONDARY = "SECONDARY",
}

export const UseCaseSubtypeField = createEnumField(UseCaseSubtype);

export const UseCaseImportanceLevelField = createEnumField(
  UseCaseImportanceLevel,
);

export const useCaseNameField = createField("string", {
  min: 1,
  minMessage: "Use case name must at least contain one characeter!",
  max: 100,
  maxMessage: "Usecase name must at most 100 characters long",
  regex: /^(?! )[A-Za-z0-9 _-]*(?<! )$/,
  message:
    "Use case name must contain only letters, numbers, spaces, hyphens, and underscores.",
  description:
    "The name of the use case (e.g., 'User Login', 'Generate Report')",
});

export const useCaseDescriptionField = createField("string", {
  min: 3,
  minMessage: "useCase description must at least contain three characters",
  max: 1000,
  maxMessage: "use case description must at most 1000 characters",
  optional: true,
  description:
    "A detailed explanation of the use case functionality, including its purpose and key behaviors",
});

// Actor relationship fields
export const primaryActorIdsField = createField("array", {
  elementType: uuidField,
  description:
    "List of UUID identifiers for primary actors who directly interact with the system",
});

export const secondaryActorIdsField = createField("array", {
  elementType: uuidField,
  description:
    "List of UUID identifiers for secondary actors who support or observe the use case",
});

// Diagram fields
export const initialStateField = createField("string", {
  min: 1,
  max: 500,
  description: "The initial state description for a use case diagram",
});

export const finalStateField = createField("string", {
  max: 500,
  optional: true,
  description: "The final state description for a use case diagram (optional)",
});

export const useCaseIdsField = createField("array", {
  elementType: uuidField,
  description: "List of UUID identifiers for use cases to include in a diagram",
});

export const actorsIdsField = createField("array", {
  elementType: uuidField,
  message: "Each actor ID must be a valid UUID format",
});

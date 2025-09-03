import { z } from "zod";
import {
  addUseCaseSchema,
  updateUseCaseSchema,
  useCaseParamsSchema,
} from "./schemas";

// Type for adding a use case
export type AddUseCaseDto = z.infer<typeof addUseCaseSchema>;

// Type for updating a use case
export type UpdateUseCaseDto = z.infer<typeof updateUseCaseSchema>;

// Type for ID parameters
export type UseCaseParamsDto = z.infer<typeof useCaseParamsSchema>;

// Enum definitions
export enum UseCaseSubtype {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  ACTOR = "actor",
  DIAGRAM = "diagram",
  RELATIONSHIP = "relationship",
}

export enum UseCaseActorType {
  PRIMARY = "PRIMARY",
  SECONDARY = "SECONDARY",
}

export enum UseCaseRelationshipType {
  INCLUDES = "INCLUDES",
  EXTENDS = "EXTENDS",
}

export enum UseCaseImportanceLevel {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

import { z } from "../zod-openapi-init";
import {
  projectIdFieldDoc,
  useCaseNameFieldDoc,
  useCaseDescriptionFieldDoc,
  primaryActorIdsFieldDoc,
  secondaryActorIdsFieldDoc,
  primaryUseCaseIdFieldDoc,
  initialStateFieldDoc,
  finalStateFieldDoc,
  useCaseIdsFieldDoc,
  useCaseImportanceEnumDoc,
  actorsIdsFieldDoc,
} from "./openapi-fields";

/**
 * =========================
 * PROJECT IDENTIFIER SCHEMA
 * =========================
 */
export const projectIdSchema = z
  .object({
    projectId: projectIdFieldDoc,
  })
  .openapi({ title: "ProjectIdDto" });

/**
 * =========================
 * PRIMARY USE CASE SCHEMAS
 * =========================
 */
export const createUseCaseSchema = z
  .object({
    name: useCaseNameFieldDoc,
    projectId: projectIdFieldDoc,
    primaryActorIds: primaryActorIdsFieldDoc,
    secondaryActorIds: secondaryActorIdsFieldDoc,
    description: useCaseDescriptionFieldDoc.optional(),
    importanceLevel: useCaseImportanceEnumDoc.optional(),
  })
  .openapi({ title: "CreateUseCaseDto" });

export const updatePrimaryUseCaseSchema = z
  .object({
    name: useCaseNameFieldDoc.optional(),
    description: useCaseDescriptionFieldDoc.optional(),
    primaryActorIds: primaryActorIdsFieldDoc.optional(),
    secondaryActorIds: secondaryActorIdsFieldDoc.optional(),
    importanceLevel: useCaseImportanceEnumDoc.optional(),
  })
  .openapi({ title: "UpdatePrimaryUseCaseDto" });

/**
 * =========================
 * SECONDARY USE CASE SCHEMAS
 * =========================
 */
export const createSecondaryUseCaseSchema = z
  .object({
    name: useCaseNameFieldDoc,
    projectId: projectIdFieldDoc,
    primaryUseCaseId: primaryUseCaseIdFieldDoc,
  })
  .openapi({ title: "CreateSecondaryUseCaseDto" });

export const updateSecondaryUseCaseSchema = z
  .object({
    name: useCaseNameFieldDoc.optional(),
    primaryUseCaseId: primaryUseCaseIdFieldDoc.optional(),
  })
  .openapi({ title: "UpdateSecondaryUseCaseDto" });

/**
 * =========================
 * USE CASE DIAGRAM SCHEMAS
 * =========================
 */
export const createDiagramSchema = z
  .object({
    projectId: projectIdFieldDoc,
    initial: initialStateFieldDoc,
    final: finalStateFieldDoc.optional(),
    useCaseIds: useCaseIdsFieldDoc.optional(),
  })
  .openapi({ title: "CreateDiagramDto" });

export const updateDiagramSchema = z
  .object({
    initial: initialStateFieldDoc.optional(),
    final: finalStateFieldDoc.optional(),
  })
  .openapi({ title: "UpdateDiagramDto" });

/**
 * =========================
 * ACTOR MANAGEMENT SCHEMAS
 * =========================
 */
export const actorsSchema = z.object({
  actorIds: actorsIdsFieldDoc,
});

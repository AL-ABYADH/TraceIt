import { z } from "../zod-openapi-init";
import {
  actorIdsFieldDoc,
  conditionFieldDoc,
  operationFieldDoc,
  useCaseIdFieldDoc,
} from "./openapi-fields";
import { nameFieldDoc, requirementIdFieldDoc } from "../common";

/**
 * =========================
 * QUERY SCHEMAS
 * =========================
 */

/** Request payload containing a `useCaseId` to identify a use case. */
export const useCaseIdSchema = z
  .object({
    useCaseId: useCaseIdFieldDoc,
  })
  .openapi({ title: "UseCaseIdDto" });

/**
 * =========================
 * CREATE SCHEMAS - SIMPLE REQUIREMENTS
 * =========================
 */

/** DTO used to create an Event System Requirement (system requirement tied to an event actor). */
export const createRequirementSchema = z
  .object({
    operation: operationFieldDoc,
    useCaseId: useCaseIdFieldDoc,
    condition: conditionFieldDoc.optional(),
    actorIds: actorIdsFieldDoc.optional(),
  })
  .openapi({ title: "CreateEventSystemRequirementDto" });

export const createRequirementExceptionSchema = z.object({
  name: nameFieldDoc,
  requirementIds: z.array(requirementIdFieldDoc),
});

export const updateRequirementSchema = z.object({
  operation: operationFieldDoc.optional(),
  condition: conditionFieldDoc.optional(),
  actorIds: actorIdsFieldDoc.optional(),
});

export const updateRequirementExceptionSchema = z.object({
  name: nameFieldDoc.optional(),
});

import z from "zod";
import { actorSchema } from "../actor";
import {
  childIdFieldDoc,
  dateISOFieldDoc,
  exceptionIdFieldDoc,
  nameFieldDoc,
  requirementIdFieldDoc,
  uuidFieldDoc,
} from "../common";
import { secondaryUseCaseDetailSchema, useCaseDetailSchema } from "../use-case";
import {
  actorIdsFieldDoc,
  conditionFieldDoc,
  operationFieldDoc,
  useCaseIdFieldDoc,
} from "./openapi-fields";

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

export const createRequirementSchema = z
  .object({
    operation: operationFieldDoc,
    useCaseId: useCaseIdFieldDoc.optional(),
    condition: conditionFieldDoc.optional(),
    actorIds: actorIdsFieldDoc.optional(),
    exceptionId: exceptionIdFieldDoc.optional(),
    parentRequirementId: requirementIdFieldDoc.optional(),
  })
  .refine((data) => !(data.exceptionId && data.parentRequirementId), {
    message: "You must provide either parentRequirementId or exceptionId, but not both.",
    path: ["exceptionId", "parentRequirementId"],
  })
  .refine((data) => !(data.useCaseId && data.exceptionId), {
    message: "You cannot have both use case and exception.",
    path: ["useCaseId", "exceptionId"],
  })
  .refine((data) => !(data.useCaseId && data.parentRequirementId), {
    message: "You cannot have both use case and parent requirement.",
    path: ["useCaseId", "parentRequirementId"],
  })
  .refine((data) => !!(data.useCaseId || data.exceptionId || data.parentRequirementId), {
    message: "You must provide either useCaseId, exceptionId, or parentRequirementId.",
    path: ["useCaseId", "exceptionId", "parentRequirementId"],
  })
  .openapi({ title: "CreateRequirementDto" });

export const createRequirementExceptionSchema = z.object({
  name: nameFieldDoc,
  requirementId: requirementIdFieldDoc,
});

export const updateRequirementSchema = z.object({
  operation: operationFieldDoc.optional(),
  condition: conditionFieldDoc.optional(),
  actorIds: actorIdsFieldDoc.optional(),
});

export const updateRequirementExceptionSchema = z.object({
  name: nameFieldDoc.optional(),
});

export const requirementExceptionListSchema = z
  .object({
    id: uuidFieldDoc,
    name: nameFieldDoc,
    createdAt: dateISOFieldDoc,
    updatedAt: dateISOFieldDoc.optional(),
  })
  .openapi({ title: "RequirementExceptionAttributes" });

export const requirementListSchema = z
  .object({
    id: requirementIdFieldDoc,
    operation: operationFieldDoc,
    condition: conditionFieldDoc.optional(),
    createdAt: dateISOFieldDoc,
    updatedAt: dateISOFieldDoc.optional(),
  })
  .openapi({ title: "RequirementAttributes" });

export const requirementRelationshipsSchema = z
  .object({
    useCase: useCaseDetailSchema,
    secondaryUseCase: secondaryUseCaseDetailSchema.optional(),
    actors: z.array(actorSchema).optional(),
    nestedRequirements: z.array(requirementListSchema).optional(),
    exceptions: z.array(requirementExceptionListSchema).optional(),
  })
  .openapi({ title: "RequirementRelationships" });

export const requirementExceptionRelationshipsSchema = z
  .object({
    // Use full Requirement detail so exception.requirements include relationships (actors, nested, exceptions, ...)
    requirements: z.array(z.lazy(() => requirementDetailSchema)),
  })
  .openapi({ title: "RequirementExceptionRelationships" });

export const requirementExceptionDetailSchema = requirementExceptionListSchema
  .merge(requirementExceptionRelationshipsSchema)
  .openapi({ title: "RequirementExceptionDto" });

export const requirementDetailSchema = requirementListSchema
  .merge(requirementRelationshipsSchema)
  .openapi({ title: "RequirementDto" });

export const requirementIdSchema = z
  .object({
    requirementId: requirementIdFieldDoc,
  })
  .openapi({ title: "RequirementId" });
export const requirementOptionalIdSchema = z
  .object({
    requirementId: requirementIdFieldDoc.optional(),
  })
  .openapi({ title: "RequirementId" });

export const requirementExceptionIdSchema = z
  .object({
    requirementExceptionId: requirementIdFieldDoc,
  })
  .openapi({ title: "RequirementExceptionId" });

export const exceptionIdSchema = z
  .object({
    exceptionId: exceptionIdFieldDoc,
  })
  .openapi({ title: "ExceptionId" });
export const childIdSchema = z
  .object({
    childId: childIdFieldDoc,
  })
  .openapi({ title: "ExceptionId" });

import { booleanFieldDoc, dateFieldDoc, requirementIdFieldDoc, uuidFieldDoc } from "../common";
import { requirementDetailSchema, requirementListSchema, useCaseIdFieldDoc } from "../requirement";
import { useCaseDetailSchema, useCaseListSchema } from "../use-case";
import { z } from "../zod-openapi-init";
import { activityNameFieldDoc, conditionNameFieldDoc } from "./openapi-fields";

export const activityIdSchema = z
  .object({
    activityId: uuidFieldDoc,
  })
  .openapi({ title: "ActivityIdDto" });

export const createActivitySchema = z
  .object({
    name: activityNameFieldDoc,
    requirementId: requirementIdFieldDoc,
    useCaseId: useCaseIdFieldDoc,
  })
  .openapi({ title: "CreateActivityDto" });

export const updateActivitySchema = z
  .object({
    name: activityNameFieldDoc.optional(),
    requirementUpdated: booleanFieldDoc,
  })
  .openapi({ title: "UpdateActivityDto" });

export const activitySchema = z
  .object({
    id: uuidFieldDoc,
    name: activityNameFieldDoc,
    requirementUpdated: booleanFieldDoc,
    createdAt: dateFieldDoc,
    updatedAt: dateFieldDoc.optional(),
    requirement: requirementListSchema.optional(),
    useCase: useCaseListSchema.optional(),
  })
  .openapi({ title: "ActivityAttributes" });

export const useCaseOptionalIdSchema = z
  .object({
    useCaseId: useCaseIdFieldDoc.optional(),
  })
  .openapi({ title: "UseCaseOptionalIdDto" });

export const conditionIdSchema = z
  .object({
    conditionId: uuidFieldDoc,
  })
  .openapi({ title: "ConditionIdDto" });

export const createConditionSchema = z
  .object({
    name: conditionNameFieldDoc,
    requirementId: requirementIdFieldDoc,
    useCaseId: useCaseIdFieldDoc,
  })
  .openapi({ title: "CreateConditionDto" });

export const updateConditionSchema = z
  .object({
    name: conditionNameFieldDoc.optional(),
    requirementUpdated: booleanFieldDoc,
  })
  .openapi({ title: "UpdateConditionDto" });

export const conditionSchema = z
  .object({
    id: uuidFieldDoc,
    name: conditionNameFieldDoc,
    requirementUpdated: booleanFieldDoc,
    createdAt: dateFieldDoc,
    updatedAt: dateFieldDoc.optional(),
    useCase: useCaseListSchema.optional(),
    requirement: requirementListSchema.optional(),
  })
  .openapi({ title: "ConditionAttributes" });

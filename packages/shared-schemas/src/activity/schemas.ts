import { dateFieldDoc, requirementIdFieldDoc, uuidFieldDoc } from "../common";
import { useCaseIdFieldDoc } from "../requirement";
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
  })
  .openapi({ title: "UpdateActivityDto" });

export const activitySchema = z
  .object({
    id: uuidFieldDoc,
    name: activityNameFieldDoc,
    createdAt: dateFieldDoc,
    updatedAt: dateFieldDoc.optional(),
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
  })
  .openapi({ title: "UpdateConditionDto" });

export const conditionSchema = z
  .object({
    id: uuidFieldDoc,
    name: conditionNameFieldDoc,
    createdAt: dateFieldDoc,
    updatedAt: dateFieldDoc.optional(),
  })
  .openapi({ title: "ConditionAttributes" });

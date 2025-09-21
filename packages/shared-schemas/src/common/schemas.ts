import { z } from "../zod-openapi-init";
import { dateISOField } from "./fields";
import {
  descriptionFieldDoc,
  projectIdFieldDoc,
  projectStatusFieldDoc,
  uuidFieldDoc,
} from "./openapi-fields";

// ----------------------
// Custom Validators
// ----------------------

export const atLeastOneOfSchema = <T extends Record<string, z.ZodTypeAny>>(
  fields: T,
  requiredFields: (keyof T)[],
) => {
  return z
    .object(fields)
    .refine(
      (data) =>
        requiredFields.some(
          (field) => data[field] !== undefined && data[field] !== null,
        ),
      {
        message: `At least one of the following fields must be provided: ${requiredFields.join(", ")}`,
      },
    );
};

export const uuidParamsSchema = z.object({
  id: uuidFieldDoc,
});

export const projectSchema = z
  .object({
    id: projectIdFieldDoc,
    name: z.string(),
    description: descriptionFieldDoc.optional(),
    status: projectStatusFieldDoc,
    createdAt: z.union([dateISOField, z.date()]),
    updatedAt: z.union([dateISOField, z.date()]).optional(),
  })
  .openapi({ title: "ProjectListDto" });

export const projectStatusSchema = z.object({
  status: projectStatusFieldDoc,
});

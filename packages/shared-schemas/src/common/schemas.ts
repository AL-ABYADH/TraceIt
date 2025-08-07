import { z } from "../zod-openapi-init";
import { uuidFieldDoc } from "./openapi-fields";

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

// ----------------------
// Pagination & Query
// ----------------------

export const paginationSchema = z.object({
  page: z.number().int().positive().default(1).openapi({ example: 1 }),
  limit: z
    .number()
    .int()
    .positive()
    .max(100)
    .default(10)
    .openapi({ example: 10 }),
  sortBy: z.string().optional().openapi({ example: "createdAt" }),
  sortOrder: z
    .enum(["asc", "desc"])
    .default("asc")
    .openapi({ example: "desc" }),
});

export const uuidParamsSchema = z.object({
  id: uuidFieldDoc,
});

export const searchQuerySchema = z.object({
  q: z.string().min(1).optional().openapi({ example: "search term" }),
  ...paginationSchema.shape,
});

// ----------------------
// Response Schemas
// ----------------------

export const baseResponseSchema = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z
    .string()
    .optional()
    .openapi({ example: "Operation completed successfully" }),
  timestamp: z
    .date()
    .default(() => new Date())
    .openapi({ example: new Date().toISOString() }),
});

export const errorResponseSchema = baseResponseSchema.extend({
  success: z.literal(false).openapi({ example: false }),
  error: z.object({
    code: z.string().openapi({ example: "VALIDATION_ERROR" }),
    details: z
      .record(z.any())
      .optional()
      .openapi({
        example: { field: "email", message: "Invalid email format" },
      }),
  }),
});

export const successResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  baseResponseSchema.extend({
    success: z.literal(true).openapi({ example: true }),
    data: dataSchema,
  });

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(
  itemSchema: T,
) =>
  successResponseSchema(
    z.object({
      items: z.array(itemSchema).openapi({ example: [] }),
      pagination: z.object({
        page: z.number().openapi({ example: 1 }),
        limit: z.number().openapi({ example: 10 }),
        total: z.number().openapi({ example: 200 }),
        totalPages: z.number().openapi({ example: 20 }),
        hasNext: z.boolean().openapi({ example: true }),
        hasPrevious: z.boolean().openapi({ example: false }),
      }),
    }),
  );

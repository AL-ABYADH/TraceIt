import { z } from "../zod-openapi-init";
import {
  paginationSchema,
  uuidParamsSchema,
  searchQuerySchema,
  baseResponseSchema,
  errorResponseSchema,
  successResponseSchema,
  paginatedResponseSchema,
} from "./schemas";

// ----------------------
// Type Exports
// ----------------------

export type PaginationDto = z.infer<typeof paginationSchema>;
export type UuidParamsDto = z.infer<typeof uuidParamsSchema>;
export type SearchQueryDto = z.infer<typeof searchQuerySchema>;
export type BaseResponse = z.infer<typeof baseResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
export type SuccessResponse<T> = z.infer<
  ReturnType<typeof successResponseSchema<z.ZodType<T>>>
>;
export type PaginatedResponse<T> = z.infer<
  ReturnType<typeof paginatedResponseSchema<z.ZodType<T>>>
>;

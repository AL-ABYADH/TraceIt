import { z } from "../zod-openapi-init";
import { projectStatusSchema, uuidParamsSchema } from "./schemas";

// ----------------------
// Type Exports
// ----------------------

export type UuidParamsDto = z.infer<typeof uuidParamsSchema>;
export type ProjectStatusDto = z.infer<typeof projectStatusSchema>;

import { z } from "../zod-openapi-init";
import { uuidParamsSchema } from "./schemas";

// ----------------------
// Type Exports
// ----------------------

export type UuidParamsDto = z.infer<typeof uuidParamsSchema>;

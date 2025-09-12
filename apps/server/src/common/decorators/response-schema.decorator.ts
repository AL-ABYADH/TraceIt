import { SetMetadata } from "@nestjs/common";
import type { ZodSchema } from "zod";

export const RESPONSE_SCHEMA_KEY = "RESPONSE_SCHEMA_KEY";
export const ResponseSchema = (schema: ZodSchema<any>) => SetMetadata(RESPONSE_SCHEMA_KEY, schema);

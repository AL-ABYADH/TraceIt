import { ZodSchema } from "zod";
import { ZodValidationPipe } from "./zod-validation.pipe";

export const zodBody = (schema: ZodSchema) => new ZodValidationPipe(schema);
export const zodParam = (schema: ZodSchema) => new ZodValidationPipe(schema);
export const zodQuery = (schema: ZodSchema) => new ZodValidationPipe(schema);

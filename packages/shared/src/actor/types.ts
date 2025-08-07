import { z } from "../zod-openapi-init";
import { createActorSchema, updateActorSchema } from "./schemas";

export type CreateActorDto = z.infer<typeof createActorSchema>;
export type UpdateActorDto = z.infer<typeof updateActorSchema>;

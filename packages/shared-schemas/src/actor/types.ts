import { z } from "../zod-openapi-init";
import { addActorSchema, updateActorSchema } from "./schemas";

export type AddActorDto = z.infer<typeof addActorSchema>;
export type UpdateActorDto = z.infer<typeof updateActorSchema>;

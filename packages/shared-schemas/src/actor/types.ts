import { z } from "../zod-openapi-init";
import {
  actorTypeSchema,
  addActorSchema,
  actorSubtypeActorSchema,
  updateActorSchema,
} from "./schemas";

export type AddActorDto = z.infer<typeof addActorSchema>;
export type UpdateActorDto = z.infer<typeof updateActorSchema>;
export type SubTypeActorDto = z.infer<typeof actorSubtypeActorSchema>;
export type ActorTypeDto = z.infer<typeof actorTypeSchema>;

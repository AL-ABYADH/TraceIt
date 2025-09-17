import { z } from "../zod-openapi-init";
import {
  actorTypeSchema,
  addActorSchema,
  actorSubtypeSchema,
  updateActorSchema,
  actorSchema,
} from "./schemas";

export type AddActorDto = z.infer<typeof addActorSchema>;
export type UpdateActorDto = z.infer<typeof updateActorSchema>;
export type SubTypeActorDto = z.infer<typeof actorSubtypeSchema>;
export type ActorTypeDto = z.infer<typeof actorTypeSchema>;
export type ActorDto = z.infer<typeof actorSchema>;
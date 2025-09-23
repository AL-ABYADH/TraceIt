import { postEntityWithRelationshipsSchemas } from "./schemas";
import { z } from "../zod-openapi-init";

export type EntityRelationshipRequestDto = z.infer<
  typeof postEntityWithRelationshipsSchemas
>;

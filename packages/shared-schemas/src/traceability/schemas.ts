import { uuidField, uuidFieldDoc } from "../common";
import { modelsListDoc } from "./openapi-fields";
import { z } from "../zod-openapi-init";

export const postEntityWithRelationshipsSchemas = z.object({
  projectId: uuidFieldDoc,
  entityId: uuidFieldDoc,
  models: modelsListDoc,
});

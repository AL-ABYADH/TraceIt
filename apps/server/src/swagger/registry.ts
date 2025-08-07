// import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

// export const registry = new OpenAPIRegistry();
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import type { ZodTypeAny } from "zod";

export const registry = new OpenAPIRegistry();

export function registerMultiple(registry: OpenAPIRegistry, schemas: Record<string, ZodTypeAny>) {
  for (const [key, schema] of Object.entries(schemas)) {
    registry.register(key, schema);
  }
}

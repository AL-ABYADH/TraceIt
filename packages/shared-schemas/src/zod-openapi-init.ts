// backend/src/zod-openapi-init.ts
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

// Extend Zod with OpenAPI support
extendZodWithOpenApi(z);

// Re-export the extended `z` for use in other files
export { z };

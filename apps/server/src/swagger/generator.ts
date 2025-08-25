import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./registry";
import type { OpenAPIObject } from "openapi3-ts/oas30";

export const generateOpenApiDocument = (): OpenAPIObject => {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "TraceIt API",
      version: "1.0.0",
    },
  });
};

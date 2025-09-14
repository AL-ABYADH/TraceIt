import { registerMultiple, registry } from "../registry";
import { projectIdSchema, useCaseDetailSchema } from "@repo/shared-schemas";
// Register DTOs
registerMultiple(registry, {
  ProjectIdDto: projectIdSchema,
  UseCaseDetailDto: useCaseDetailSchema,
});

registry.registerPath({
  method: "get",
  path: "/use-cases",
  tags: ["UseCase"],
  request: {
    query: projectIdSchema,
  },
  responses: {
    200: {
      description: "Successful response",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              $ref: "#/components/schemas/UseCaseDetailDto",
            },
          },
        },
      },
    },
    400: {
      description: "Bad request",
    },
    500: {
      description: "Internal Server Error",
    },
  },
});

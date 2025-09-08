import { registerMultiple, registry } from "../registry";
import { projectIdSchema } from "@repo/shared-schemas";
// Register DTOs
registerMultiple(registry, {
  ProjectIdDto: projectIdSchema,
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
    },
    400: {
      description: "Bad request",
    },
    500: {
      description: "Internal Server Error",
    },
  },
});

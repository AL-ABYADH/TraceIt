import { registerMultiple, registry } from "../registry";
import { updateUserSchema, uuidParamsSchema } from "@repo/shared-schemas";
// Register DTOs
registerMultiple(registry, {
  UpdateUserDto: updateUserSchema,
  UuidParamsDto: uuidParamsSchema,
});

registry.registerPath({
  method: "put",
  path: "/users/{id}",
  tags: ["User"],
  request: {
    body: {
      description: "UpdateUserDto request body",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UpdateUserDto",
          },
        },
      },
    },
    params: uuidParamsSchema,
  },
  responses: {
    200: {
      description: "Successful response",
    },
    400: {
      description: "Bad request",
    },
    404: {
      description: "Not Found",
    },
    500: {
      description: "Internal Server Error",
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/users/{id}",
  tags: ["User"],
  request: {
    params: uuidParamsSchema,
  },
  responses: {
    200: {
      description: "Successful response",
    },
    400: {
      description: "Bad request",
    },
    404: {
      description: "Not Found",
    },
    500: {
      description: "Internal Server Error",
    },
  },
});

registry.registerPath({
  method: "put",
  path: "/users/{id}/verify-email",
  tags: ["User"],
  request: {
    params: uuidParamsSchema,
  },
  responses: {
    200: {
      description: "Successful response",
    },
    400: {
      description: "Bad request",
    },
    404: {
      description: "Not Found",
    },
    500: {
      description: "Internal Server Error",
    },
  },
});

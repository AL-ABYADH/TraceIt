import { registerMultiple, registry } from "../registry";
import { updateUserSchema, uuidParamsSchema } from "@repo/shared-schemas";
// Register DTOs
registerMultiple(registry, {
  UpdateUserDto: updateUserSchema,
  UuidParamsDto: uuidParamsSchema,
});

registry.registerPath({
  method: "put",
  path: "/users/:id",
  tags: ["User"],
  request: {
    body: {
      description: "UpdateUserDto request body",
      required: true,
      content: {
        "application/json": { schema: { $ref: "#/components/schemas/UpdateUserDto" } },
      },
    },
    params: uuidParamsSchema,
  },
  responses: {
    200: { description: "Successful response" },
  },
});

registry.registerPath({
  method: "get",
  path: "/users/:id",
  tags: ["User"],
  request: {
    params: uuidParamsSchema,
  },
  responses: {
    200: { description: "Successful response" },
  },
});

registry.registerPath({
  method: "put",
  path: "/users/:id/verify-email",
  tags: ["User"],
  request: {
    params: uuidParamsSchema,
  },
  responses: {
    200: { description: "Successful response" },
  },
});

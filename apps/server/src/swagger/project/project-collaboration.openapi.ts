import { registerMultiple, registry } from "../registry";
import { updateProjectCollaborationSchema, uuidParamsSchema } from "@repo/shared-schemas";
// Register DTOs
registerMultiple(registry, {
  UpdateProjectCollaborationDto: updateProjectCollaborationSchema,
  UuidParamsDto: uuidParamsSchema,
});

registry.registerPath({
  method: "put",
  path: "/project-collaborations/:id",
  tags: ["ProjectCollaboration"],
  request: {
    body: {
      description: "UpdateProjectCollaborationDto request body",
      required: true,
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/UpdateProjectCollaborationDto" },
        },
      },
    },
    params: uuidParamsSchema,
  },
  responses: {
    200: { description: "Successful response" },
  },
});

registry.registerPath({
  method: "delete",
  path: "/project-collaborations/:id",
  tags: ["ProjectCollaboration"],
  request: {
    params: uuidParamsSchema,
  },
  responses: {
    200: { description: "Successful response" },
  },
});

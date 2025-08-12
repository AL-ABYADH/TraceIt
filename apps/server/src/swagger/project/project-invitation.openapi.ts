import { registerMultiple, registry } from "../registry";
import { createProjectInvitationSchema, uuidParamsSchema } from "@repo/shared-schemas";
// Register DTOs
registerMultiple(registry, {
  CreateProjectInvitationDto: createProjectInvitationSchema,
  UuidParamsDto: uuidParamsSchema,
});

registry.registerPath({
  method: "post",
  path: "/project-invitations",
  tags: ["ProjectInvitation"],
  request: {
    body: {
      description: "CreateProjectInvitationDto request body",
      required: true,
      content: {
        "application/json": { schema: { $ref: "#/components/schemas/CreateProjectInvitationDto" } },
      },
    },
  },
  responses: {
    200: { description: "Successful response" },
  },
});

registry.registerPath({
  method: "patch",
  path: "/project-invitations/:id/accept",
  tags: ["ProjectInvitation"],
  request: {
    params: uuidParamsSchema,
  },
  responses: {
    200: { description: "Successful response" },
  },
});

registry.registerPath({
  method: "patch",
  path: "/project-invitations/:id/deny",
  tags: ["ProjectInvitation"],
  request: {
    params: uuidParamsSchema,
  },
  responses: {
    200: { description: "Successful response" },
  },
});

registry.registerPath({
  method: "patch",
  path: "/project-invitations/:id/cancel",
  tags: ["ProjectInvitation"],
  request: {
    params: uuidParamsSchema,
  },
  responses: {
    200: { description: "Successful response" },
  },
});

import { registerMultiple, registry } from "../registry";
import { createProjectSchema, updateProjectSchema, uuidParamsSchema } from "@repo/shared-schemas";
// Register DTOs
registerMultiple(registry, {
  CreateProjectDto: createProjectSchema,
  UpdateProjectDto: updateProjectSchema,
  UuidParamsDto: uuidParamsSchema,
});

registry.registerPath({
  method: "get",
  path: "/projects",
  tags: ["Project"],

  responses: {
    200: { description: "Successful response" },
  },
});

registry.registerPath({
  method: "get",
  path: "/projects/:id",
  tags: ["Project"],
  request: {
    params: uuidParamsSchema,
  },
  responses: {
    200: { description: "Successful response" },
  },
});

registry.registerPath({
  method: "post",
  path: "/projects",
  tags: ["Project"],
  request: {
    body: {
      description: "CreateProjectDto request body",
      required: true,
      content: {
        "application/json": { schema: { $ref: "#/components/schemas/CreateProjectDto" } },
      },
    },
  },
  responses: {
    200: { description: "Successful response" },
  },
});

registry.registerPath({
  method: "put",
  path: "/projects/:id",
  tags: ["Project"],
  request: {
    body: {
      description: "UpdateProjectDto request body",
      required: true,
      content: {
        "application/json": { schema: { $ref: "#/components/schemas/UpdateProjectDto" } },
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
  path: "/projects/:id",
  tags: ["Project"],
  request: {
    params: uuidParamsSchema,
  },
  responses: {
    200: { description: "Successful response" },
  },
});

registry.registerPath({
  method: "patch",
  path: "/projects/:id/activate",
  tags: ["Project"],
  request: {
    params: uuidParamsSchema,
  },
  responses: {
    200: { description: "Successful response" },
  },
});

registry.registerPath({
  method: "patch",
  path: "/projects/:id/archive",
  tags: ["Project"],
  request: {
    params: uuidParamsSchema,
  },
  responses: {
    200: { description: "Successful response" },
  },
});

registry.registerPath({
  method: "get",
  path: "/projects/:id/project-collaborations",
  tags: ["Project"],
  request: {
    params: uuidParamsSchema,
  },
  responses: {
    200: { description: "Successful response" },
  },
});

import { registerMultiple, registry } from "../registry";
import {
  createProjectRoleSchema,
  updateProjectRoleSchema,
  uuidParamsSchema,
} from "@repo/shared-schemas";
// Register DTOs
registerMultiple(registry, {
  CreateProjectRoleDto: createProjectRoleSchema,
  UpdateProjectRoleDto: updateProjectRoleSchema,
  UuidParamsDto: uuidParamsSchema,
});

registry.registerPath({
  method: "post",
  path: "/project-roles",
  tags: ["ProjectRole"],
  request: {
    body: {
      description: "CreateProjectRoleDto request body",
      required: true,
      content: {
        "application/json": { schema: { $ref: "#/components/schemas/CreateProjectRoleDto" } },
      },
    },
  },
  responses: {
    200: { description: "Successful response" },
  },
});

registry.registerPath({
  method: "get",
  path: "/project-roles/:id",
  tags: ["ProjectRole"],
  request: {
    params: uuidParamsSchema,
  },
  responses: {
    200: { description: "Successful response" },
  },
});

registry.registerPath({
  method: "get",
  path: "/project-roles",
  tags: ["ProjectRole"],

  responses: {
    200: { description: "Successful response" },
  },
});

registry.registerPath({
  method: "put",
  path: "/project-roles/:id",
  tags: ["ProjectRole"],
  request: {
    body: {
      description: "UpdateProjectRoleDto request body",
      required: true,
      content: {
        "application/json": { schema: { $ref: "#/components/schemas/UpdateProjectRoleDto" } },
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
  path: "/project-roles/:id",
  tags: ["ProjectRole"],
  request: {
    params: uuidParamsSchema,
  },
  responses: {
    200: { description: "Successful response" },
  },
});

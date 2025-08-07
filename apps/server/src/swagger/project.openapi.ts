import {
  createProjectSchema,
  updateProjectSchema,
  createProjectPermissionSchema,
  updateProjectPermissionSchema,
  createProjectRoleSchema,
  updateProjectRoleSchema,
  updateProjectCollaborationSchema,
  createProjectInvitationSchema,
  uuidParamsSchema,
} from "@repo/shared";
import { registerMultiple, registry } from "./registry";

// Register all schemas (DTOs)
registerMultiple(registry, {
  CreateProjectDto: createProjectSchema,
  UpdateProjectDto: updateProjectSchema,
  CreateProjectPermissionDto: createProjectPermissionSchema,
  UpdateProjectPermissionDto: updateProjectPermissionSchema,
  CreateProjectRoleDto: createProjectRoleSchema,
  UpdateProjectRoleDto: updateProjectRoleSchema,
  UpdateProjectCollaborationDto: updateProjectCollaborationSchema,
  CreateProjectInvitationDto: createProjectInvitationSchema,
  UuidParamsDto: uuidParamsSchema,
});

// -------- POST /projects - Create project --------
registry.registerPath({
  method: "post",
  path: "/projects",
  tags: ["Project"],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createProjectSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Project created successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
            },
          },
        },
      },
    },
    400: { description: "Validation error" },
  },
});

// -------- PUT /projects/{id} - Update project --------
registry.registerPath({
  method: "put",
  path: "/projects/{id}",
  tags: ["Project"],
  request: {
    params: uuidParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/UpdateProjectDto" },
        },
      },
    },
  },
  responses: {
    200: {
      description: "Project updated successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
            },
          },
        },
      },
    },
    400: { description: "Validation error" },
    404: { description: "Project not found" },
  },
});

// -------- GET /projects - List user projects --------
registry.registerPath({
  method: "get",
  path: "/projects",
  tags: ["Project"],
  responses: {
    200: {
      description: "List of projects",
      content: {
        "application/json": {
          schema: {
            type: "array",
          },
        },
      },
    },
  },
});

// -------- GET /projects/{id} - Get project --------
registry.registerPath({
  method: "get",
  path: "/projects/{id}",
  tags: ["Project"],
  request: {
    params: uuidParamsSchema,
  },
  responses: {
    200: {
      description: "Project fetched successfully",
      content: {
        "application/json": {
          schema: createProjectSchema,
        },
      },
    },
    404: { description: "Project not found" },
  },
});

// -------- DELETE /projects/{id} - Delete project --------
registry.registerPath({
  method: "delete",
  path: "/projects/{id}",
  tags: ["Project"],
  request: {
    params: uuidParamsSchema,
  },
  responses: {
    200: {
      description: "Project deleted",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
            },
          },
        },
      },
    },
    404: { description: "Project not found" },
  },
});

// -------- PATCH /projects/{id}/activate - Activate project --------
registry.registerPath({
  method: "patch",
  path: "/projects/{id}/activate",
  tags: ["Project"],
  request: {
    params: uuidParamsSchema,
  },
  responses: {
    200: {
      description: "Project activated",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
            },
          },
        },
      },
    },
    404: { description: "Project not found" },
  },
});

// -------- PATCH /projects/{id}/archive - Archive project --------
registry.registerPath({
  method: "patch",
  path: "/projects/{id}/archive",
  tags: ["Project"],
  request: {
    params: uuidParamsSchema,
  },
  responses: {
    200: {
      description: "Project archived",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
            },
          },
        },
      },
    },
    404: { description: "Project not found" },
  },
});

// -------- GET /projects/{id}/project-collaborations - List project collaborations --------
registry.registerPath({
  method: "get",
  path: "/projects/{id}/project-collaborations",
  tags: ["Project Collaboration"],
  request: {
    params: uuidParamsSchema,
  },
  responses: {
    200: {
      description: "List of project collaborations",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: { $ref: "#/components/schemas/ProjectCollaboration" },
          },
        },
      },
    },
    404: { description: "Project not found" },
  },
});

// -------- POST /project-permissions - Create project permission --------
registry.registerPath({
  method: "post",
  path: "/project-permissions",
  tags: ["Project Permission"],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createProjectPermissionSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Project permission created successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
            },
          },
        },
      },
    },
    400: { description: "Validation error" },
  },
});

// -------- PUT /project-permissions/{id} - Update project permission --------
registry.registerPath({
  method: "put",
  path: "/project-permissions/{id}",
  tags: ["Project Permission"],
  request: {
    params: uuidParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateProjectPermissionSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Project permission updated successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
            },
          },
        },
      },
    },
    400: { description: "Validation error" },
    404: { description: "Project permission not found" },
  },
});

// -------- POST /project-roles - Create project role --------
registry.registerPath({
  method: "post",
  path: "/project-roles",
  tags: ["Project Role"],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createProjectRoleSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Project role created successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
            },
          },
        },
      },
    },
    400: { description: "Validation error" },
  },
});

// -------- PUT /project-roles/{id} - Update project role --------
registry.registerPath({
  method: "put",
  path: "/project-roles/{id}",
  tags: ["Project Role"],
  request: {
    params: uuidParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateProjectRoleSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Project role updated successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
            },
          },
        },
      },
    },
    400: { description: "Validation error" },
    404: { description: "Project role not found" },
  },
});

// -------- PATCH /project-collaborations/{id} - Update project collaboration --------
registry.registerPath({
  method: "patch",
  path: "/project-collaborations/{id}",
  tags: ["Project Collaboration"],
  request: {
    params: uuidParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateProjectCollaborationSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Project collaboration updated successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
            },
          },
        },
      },
    },
    400: { description: "Validation error" },
    404: { description: "Project collaboration not found" },
  },
});

// -------- POST /project-invitations - Create project invitation --------
registry.registerPath({
  method: "post",
  path: "/project-invitations",
  tags: ["Project Invitation"],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createProjectInvitationSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Project invitation created successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
            },
          },
        },
      },
    },
    400: { description: "Validation error" },
  },
});

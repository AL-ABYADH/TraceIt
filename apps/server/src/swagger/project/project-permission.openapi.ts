import { registerMultiple, registry } from "../registry";
import {
  createProjectPermissionSchema,
  updateProjectPermissionSchema,
  uuidParamsSchema,
} from "@repo/shared-schemas";
// Register DTOs
registerMultiple(registry, {
  CreateProjectPermissionDto: createProjectPermissionSchema,
  UpdateProjectPermissionDto: updateProjectPermissionSchema,
  UuidParamsDto: uuidParamsSchema,
});

registry.registerPath({
  method: "post",
  path: "/project-permissions",
  tags: ["ProjectPermission"],
  request: {
    body: {
      description: "CreateProjectPermissionDto request body",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/CreateProjectPermissionDto",
          },
        },
      },
    },
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

registry.registerPath({
  method: "get",
  path: "/project-permissions/{id}",
  tags: ["ProjectPermission"],
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
  method: "get",
  path: "/project-permissions",
  tags: ["ProjectPermission"],
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

registry.registerPath({
  method: "put",
  path: "/project-permissions/{id}",
  tags: ["ProjectPermission"],
  request: {
    body: {
      description: "UpdateProjectPermissionDto request body",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UpdateProjectPermissionDto",
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
  method: "delete",
  path: "/project-permissions/{id}",
  tags: ["ProjectPermission"],
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

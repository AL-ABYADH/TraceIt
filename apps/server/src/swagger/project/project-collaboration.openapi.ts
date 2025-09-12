import { registerMultiple, registry } from "../registry";
import {
  createProjectCollaborationSchema,
  updateProjectCollaborationSchema,
  uuidParamsSchema,
} from "@repo/shared-schemas";
// Register DTOs
registerMultiple(registry, {
  CreateProjectCollaborationDto: createProjectCollaborationSchema,
  UpdateProjectCollaborationDto: updateProjectCollaborationSchema,
  UuidParamsDto: uuidParamsSchema,
});

registry.registerPath({
  method: "post",
  path: "/project-collaborations",
  tags: ["ProjectCollaboration"],
  request: {
    body: {
      description: "CreateProjectCollaborationDto request body",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/CreateProjectCollaborationDto",
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
  path: "/project-collaborations/{id}",
  tags: ["ProjectCollaboration"],
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
  path: "/project-collaborations/{id}",
  tags: ["ProjectCollaboration"],
  request: {
    body: {
      description: "UpdateProjectCollaborationDto request body",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UpdateProjectCollaborationDto",
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
  path: "/project-collaborations/{id}",
  tags: ["ProjectCollaboration"],
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

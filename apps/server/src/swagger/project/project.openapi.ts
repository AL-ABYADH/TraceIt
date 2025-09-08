import { registerMultiple, registry } from "../registry";
import {
  createProjectSchema,
  projectActionSchema,
  projectStatusSchema,
  updateProjectSchema,
  uuidParamsSchema,
} from "@repo/shared-schemas";
// Register DTOs
registerMultiple(registry, {
  CreateProjectDto: createProjectSchema,
  ProjectActionDto: projectActionSchema,
  ProjectStatusDto: projectStatusSchema,
  UpdateProjectDto: updateProjectSchema,
  UuidParamsDto: uuidParamsSchema,
});

registry.registerPath({
  method: "get",
  path: "/projects",
  tags: ["Project"],
  request: {
    query: projectStatusSchema,
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
  path: "/projects/{id}",
  tags: ["Project"],
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
  method: "post",
  path: "/projects",
  tags: ["Project"],
  request: {
    body: {
      description: "CreateProjectDto request body",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/CreateProjectDto",
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
  method: "put",
  path: "/projects/{id}",
  tags: ["Project"],
  request: {
    body: {
      description: "UpdateProjectDto request body",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UpdateProjectDto",
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
  path: "/projects/{id}",
  tags: ["Project"],
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
  method: "patch",
  path: "/projects/{id}",
  tags: ["Project"],
  request: {
    params: uuidParamsSchema,
    query: projectActionSchema,
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

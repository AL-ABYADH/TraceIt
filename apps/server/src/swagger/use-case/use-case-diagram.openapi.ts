import { registerMultiple, registry } from "../registry";
import {
  createDiagramSchema,
  projectIdSchema,
  updateDiagramSchema,
  uuidParamsSchema,
} from "@repo/shared-schemas";
// Register DTOs
registerMultiple(registry, {
  CreateDiagramDto: createDiagramSchema,
  ProjectIdDto: projectIdSchema,
  UpdateDiagramDto: updateDiagramSchema,
  UuidParamsDto: uuidParamsSchema,
});

registry.registerPath({
  method: "post",
  path: "/use-case-diagrams",
  tags: ["UseCaseDiagram"],
  request: {
    body: {
      description: "CreateDiagramDto request body",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/CreateDiagramDto",
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
  path: "/use-case-diagrams",
  tags: ["UseCaseDiagram"],
  request: {
    query: projectIdSchema,
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
  path: "/use-case-diagrams/{id}",
  tags: ["UseCaseDiagram"],
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
  path: "/use-case-diagrams/{id}",
  tags: ["UseCaseDiagram"],
  request: {
    body: {
      description: "UpdateDiagramDto request body",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UpdateDiagramDto",
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
  path: "/use-case-diagrams/{id}",
  tags: ["UseCaseDiagram"],
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
  path: "/use-case-diagrams/{id}/use-cases/{id}",
  tags: ["UseCaseDiagram"],
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
  method: "delete",
  path: "/use-case-diagrams/{id}/use-cases/{id}",
  tags: ["UseCaseDiagram"],
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

import { registerMultiple, registry } from "../registry";
import {
  createActorRequirementSchema,
  createConditionalGroupRequirementSchema,
  createConditionalRequirementSchema,
  createEventSystemRequirementSchema,
  createExceptionalRequirementSchema,
  createLogicalGroupRequirementSchema,
  createRecursiveRequirementSchema,
  createSimultaneousRequirementSchema,
  createSystemActorCommunicationRequirementSchema,
  createSystemRequirementSchema,
  createUseCaseReferenceRequirementSchema,
  requirementIdSchema,
  requirementTypeSchema,
  updateActorRequirementSchema,
  updateConditionalGroupRequirementSchema,
  updateConditionalRequirementSchema,
  updateEventSystemRequirementSchema,
  updateExceptionalRequirementSchema,
  updateLogicalGroupRequirementSchema,
  updateRecursiveRequirementSchema,
  updateSimultaneousRequirementSchema,
  updateSystemActorCommunicationRequirementSchema,
  updateSystemRequirementSchema,
  updateUseCaseReferenceRequirementSchema,
  useCaseIdSchema,
  uuidParamsSchema,
} from "@repo/shared-schemas";
// Register DTOs
registerMultiple(registry, {
  CreateActorRequirementDto: createActorRequirementSchema,
  CreateConditionalGroupRequirementDto: createConditionalGroupRequirementSchema,
  CreateConditionalRequirementDto: createConditionalRequirementSchema,
  CreateEventSystemRequirementDto: createEventSystemRequirementSchema,
  CreateExceptionalRequirementDto: createExceptionalRequirementSchema,
  CreateLogicalGroupRequirementDto: createLogicalGroupRequirementSchema,
  CreateRecursiveRequirementDto: createRecursiveRequirementSchema,
  CreateSimultaneousRequirementDto: createSimultaneousRequirementSchema,
  CreateSystemActorCommunicationRequirementDto: createSystemActorCommunicationRequirementSchema,
  CreateSystemRequirementDto: createSystemRequirementSchema,
  CreateUseCaseReferenceRequirementDto: createUseCaseReferenceRequirementSchema,
  RequirementTypeDto: requirementTypeSchema,
  UpdateActorRequirementDto: updateActorRequirementSchema,
  UpdateConditionalGroupRequirementDto: updateConditionalGroupRequirementSchema,
  UpdateConditionalRequirementDto: updateConditionalRequirementSchema,
  UpdateEventSystemRequirementDto: updateEventSystemRequirementSchema,
  UpdateExceptionalRequirementDto: updateExceptionalRequirementSchema,
  UpdateLogicalGroupRequirementDto: updateLogicalGroupRequirementSchema,
  UpdateRecursiveRequirementDto: updateRecursiveRequirementSchema,
  UpdateSimultaneousRequirementDto: updateSimultaneousRequirementSchema,
  UpdateSystemActorCommunicationRequirementDto: updateSystemActorCommunicationRequirementSchema,
  UpdateSystemRequirementDto: updateSystemRequirementSchema,
  UpdateUseCaseReferenceRequirementDto: updateUseCaseReferenceRequirementSchema,
  UseCaseIdDto: useCaseIdSchema,
  UuidParamsDto: uuidParamsSchema,
});

const requirementTypeAnduseCaseIdSchema = requirementTypeSchema.merge(useCaseIdSchema);
const requirementTypeAndrequirementIdSchema = requirementTypeSchema.merge(requirementIdSchema);

registry.registerPath({
  method: "get",
  path: "/requirements/{id}",
  tags: ["Requirement"],
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
  path: "/requirements",
  tags: ["Requirement"],
  request: {
    query: useCaseIdSchema,
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
  path: "/requirements/project/{projectId}",
  tags: ["Requirement"],
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
  path: "/requirements/type/{type}/useCase/{useCaseId}",
  tags: ["Requirement"],
  request: {
    params: requirementTypeAnduseCaseIdSchema,
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
  path: "/requirements/{id}",
  tags: ["Requirement"],
  request: {
    params: uuidParamsSchema,
  },
  responses: {
    200: {
      description: "Successful response",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: {
                type: "boolean",
              },
            },
            required: ["success"],
          },
        },
      },
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
  path: "/requirements/system",
  tags: ["Requirement"],
  request: {
    body: {
      description: "CreateSystemRequirementDto request body",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/CreateSystemRequirementDto",
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
  path: "/requirements/system/{id}",
  tags: ["Requirement"],
  request: {
    body: {
      description: "UpdateSystemRequirementDto request body",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UpdateSystemRequirementDto",
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
  method: "post",
  path: "/requirements/event-system",
  tags: ["Requirement"],
  request: {
    body: {
      description: "CreateEventSystemRequirementDto request body",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/CreateEventSystemRequirementDto",
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
  path: "/requirements/event-system/{id}",
  tags: ["Requirement"],
  request: {
    body: {
      description: "UpdateEventSystemRequirementDto request body",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UpdateEventSystemRequirementDto",
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
  method: "post",
  path: "/requirements/actor",
  tags: ["Requirement"],
  request: {
    body: {
      description: "CreateActorRequirementDto request body",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/CreateActorRequirementDto",
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
  path: "/requirements/actor/{id}",
  tags: ["Requirement"],
  request: {
    body: {
      description: "UpdateActorRequirementDto request body",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UpdateActorRequirementDto",
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
  method: "post",
  path: "/requirements/system-actor-communication",
  tags: ["Requirement"],
  request: {
    body: {
      description: "CreateSystemActorCommunicationRequirementDto request body",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/CreateSystemActorCommunicationRequirementDto",
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
  path: "/requirements/system-actor-communication/{id}",
  tags: ["Requirement"],
  request: {
    body: {
      description: "UpdateSystemActorCommunicationRequirementDto request body",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UpdateSystemActorCommunicationRequirementDto",
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
  method: "post",
  path: "/requirements/conditional",
  tags: ["Requirement"],
  request: {
    body: {
      description: "CreateConditionalRequirementDto request body",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/CreateConditionalRequirementDto",
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
  path: "/requirements/conditional/{id}",
  tags: ["Requirement"],
  request: {
    body: {
      description: "UpdateConditionalRequirementDto request body",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UpdateConditionalRequirementDto",
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
  method: "post",
  path: "/requirements/recursive",
  tags: ["Requirement"],
  request: {
    body: {
      description: "CreateRecursiveRequirementDto request body",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/CreateRecursiveRequirementDto",
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
  path: "/requirements/recursive/{id}",
  tags: ["Requirement"],
  request: {
    body: {
      description: "UpdateRecursiveRequirementDto request body",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UpdateRecursiveRequirementDto",
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
  method: "post",
  path: "/requirements/use-case-reference",
  tags: ["Requirement"],
  request: {
    body: {
      description: "CreateUseCaseReferenceRequirementDto request body",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/CreateUseCaseReferenceRequirementDto",
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
  path: "/requirements/use-case-reference/{id}",
  tags: ["Requirement"],
  request: {
    body: {
      description: "UpdateUseCaseReferenceRequirementDto request body",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UpdateUseCaseReferenceRequirementDto",
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
  method: "post",
  path: "/requirements/logical-group",
  tags: ["Requirement"],
  request: {
    body: {
      description: "CreateLogicalGroupRequirementDto request body",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/CreateLogicalGroupRequirementDto",
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
  path: "/requirements/logical-group/{id}",
  tags: ["Requirement"],
  request: {
    body: {
      description: "UpdateLogicalGroupRequirementDto request body",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UpdateLogicalGroupRequirementDto",
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
  method: "post",
  path: "/requirements/conditional-group",
  tags: ["Requirement"],
  request: {
    body: {
      description: "CreateConditionalGroupRequirementDto request body",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/CreateConditionalGroupRequirementDto",
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
  path: "/requirements/conditional-group/{id}",
  tags: ["Requirement"],
  request: {
    body: {
      description: "UpdateConditionalGroupRequirementDto request body",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UpdateConditionalGroupRequirementDto",
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
  method: "post",
  path: "/requirements/simultaneous",
  tags: ["Requirement"],
  request: {
    body: {
      description: "CreateSimultaneousRequirementDto request body",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/CreateSimultaneousRequirementDto",
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
  path: "/requirements/simultaneous/{id}",
  tags: ["Requirement"],
  request: {
    body: {
      description: "UpdateSimultaneousRequirementDto request body",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UpdateSimultaneousRequirementDto",
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
  method: "post",
  path: "/requirements/exceptional",
  tags: ["Requirement"],
  request: {
    body: {
      description: "CreateExceptionalRequirementDto request body",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/CreateExceptionalRequirementDto",
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
  path: "/requirements/exceptional/{id}",
  tags: ["Requirement"],
  request: {
    body: {
      description: "UpdateExceptionalRequirementDto request body",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UpdateExceptionalRequirementDto",
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
  method: "get",
  path: "/requirements/validate-dependency/{sourceType}/{targetId}",
  tags: ["Requirement"],
  request: {
    params: requirementTypeAndrequirementIdSchema,
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

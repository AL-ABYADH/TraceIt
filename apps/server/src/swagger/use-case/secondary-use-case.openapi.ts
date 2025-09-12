import { registerMultiple, registry } from "../registry";
import {
  createSecondaryUseCaseSchema,
  projectIdSchema,
  updateSecondaryUseCaseSchema,
  uuidParamsSchema,
} from "@repo/shared-schemas";
// Register DTOs
registerMultiple(registry, {
  CreateSecondaryUseCaseDto: createSecondaryUseCaseSchema,
  ProjectIdDto: projectIdSchema,
  UpdateSecondaryUseCaseDto: updateSecondaryUseCaseSchema,
  UuidParamsDto: uuidParamsSchema,
});

registry.registerPath({
  method: "post",
  path: "/secondary-use-cases",
  tags: ["SecondaryUseCase"],
  request: {
    body: {
      description: "CreateSecondaryUseCaseDto request body",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/CreateSecondaryUseCaseDto",
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
  path: "/secondary-use-cases",
  tags: ["SecondaryUseCase"],
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
  path: "/secondary-use-cases/{id}",
  tags: ["SecondaryUseCase"],
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
  path: "/secondary-use-cases/{id}",
  tags: ["SecondaryUseCase"],
  request: {
    body: {
      description: "UpdateSecondaryUseCaseDto request body",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UpdateSecondaryUseCaseDto",
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
  path: "/secondary-use-cases/{id}",
  tags: ["SecondaryUseCase"],
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
  path: "/secondary-use-cases/{id}/primary-use-case/{id}",
  tags: ["SecondaryUseCase"],
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

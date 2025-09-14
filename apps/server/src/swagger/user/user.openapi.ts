import { registerMultiple, registry } from "../registry";
import { safeUserDetailSchema, updateUserSchema, uuidParamsSchema } from "@repo/shared-schemas";
// Register DTOs
registerMultiple(registry, {
  SafeUserDetailDto: safeUserDetailSchema,
  UpdateUserDto: updateUserSchema,
  UuidParamsDto: uuidParamsSchema,
});

registry.registerPath({
  method: "put",
  path: "/users/{id}",
  tags: ["User"],
  request: {
    body: {
      description: "UpdateUserDto request body",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UpdateUserDto",
          },
        },
      },
    },
    params: uuidParamsSchema,
  },
  responses: {
    200: {
      description: "Successful response",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              $ref: "#/components/schemas/SafeUserDetailDto",
            },
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
  method: "put",
  path: "/users/{id}/verify-email",
  tags: ["User"],
  request: {
    params: uuidParamsSchema,
  },
  responses: {
    200: {
      description: "Successful response",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              $ref: "#/components/schemas/SafeUserDetailDto",
            },
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
  method: "get",
  path: "/users/me",
  tags: ["User"],
  responses: {
    200: {
      description: "Successful response",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/SafeUserDetailDto",
          },
        },
      },
    },
    400: {
      description: "Bad request",
    },
    500: {
      description: "Internal Server Error",
    },
  },
});

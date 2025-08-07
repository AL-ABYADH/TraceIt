import { updateUserSchema, uuidParamsSchema } from "@repo/shared";
import { registerMultiple, registry } from "./registry";

// Register schemas
registerMultiple(registry, {
  UpdateUserDto: updateUserSchema,
  UuidParamsDto: uuidParamsSchema,
});

// -------- PUT /users/{id} - Update profile --------
registry.registerPath({
  method: "put",
  path: "/users/{id}",
  tags: ["User"],
  request: {
    params: uuidParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateUserSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "User updated successfully",
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
    400: {
      description: "Validation error",
    },
  },
});

// -------- GET /users/{id} - Get user --------
registry.registerPath({
  method: "get",
  path: "/users/{id}",
  tags: ["User"],
  request: {
    params: uuidParamsSchema,
  },
  responses: {
    200: {
      description: "User retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              username: { type: "string", example: "johndoe" },
              displayName: { type: "string", example: "John Doe" },
              // Add other fields if needed
            },
          },
        },
      },
    },
    404: {
      description: "User not found",
    },
  },
});

// -------- PUT /users/{id}/verify-email - Verify email --------
registry.registerPath({
  method: "put",
  path: "/users/{id}/verify-email",
  tags: ["User"],
  request: {
    params: uuidParamsSchema,
  },
  responses: {
    200: {
      description: "Email verified successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              verified: { type: "boolean", example: true },
            },
          },
        },
      },
    },
    400: {
      description: "Invalid or expired verification request",
    },
  },
});

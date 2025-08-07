import { registerMultiple, registry } from "./registry";
import { createActorSchema, updateActorSchema } from "@repo/shared-schemas";
import { uuidParamsSchema } from "@repo/shared-schemas";

// Register DTOs
registerMultiple(registry, {
  CreateActorDto: createActorSchema,
  UpdateActorDto: updateActorSchema,
  UuidParamsDto: uuidParamsSchema,
});

// POST /actors
registry.registerPath({
  method: "post",
  path: "/actors",
  tags: ["Actors"],
  request: {
    body: {
      description: "Create a new actor",
      required: true,
      content: {
        "application/json": { schema: { $ref: "#/components/schemas/CreateActorDto" } },
      },
    },
  },
  responses: {
    201: {
      description: "Actor created successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: {
                type: "string",
                format: "uuid",
                example: "7d4e6e16-4b6b-4a62-8511-02d7d57b1b21",
              },
              name: { type: "string", example: "Admin Agent" },
              projectId: {
                type: "string",
                format: "uuid",
                example: "ae5a3c3c-7bd2-4d84-a6f6-b4b3f9b39b61",
              },
              subType: { type: "string", example: "software" },
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

// GET /actors
registry.registerPath({
  method: "get",
  path: "/actors",
  tags: ["Actors"],
  request: {
    query: uuidParamsSchema,
  },
  responses: {
    200: {
      description: "List of project actors",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  format: "uuid",
                  example: "7d4e6e16-4b6b-4a62-8511-02d7d57b1b21",
                },
                name: { type: "string", example: "Support Bot" },
                projectId: {
                  type: "string",
                  format: "uuid",
                  example: "ae5a3c3c-7bd2-4d84-a6f6-b4b3f9b39b61",
                },
                subType: { type: "string", example: "ai-agent" },
              },
            },
          },
        },
      },
    },
  },
});

// PUT /actors/:id
registry.registerPath({
  method: "put",
  path: "/actors/{id}",
  tags: ["Actors"],
  request: {
    params: uuidParamsSchema,
    body: {
      description: "Update an actor by ID",
      required: true,
      content: {
        "application/json": { schema: { $ref: "#/components/schemas/UpdateActorDto" } },
      },
    },
  },
  responses: {
    200: {
      description: "Actor updated successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              name: { type: "string", example: "Updated Actor Name" },
              projectId: { type: "string", format: "uuid" },
              subType: { type: "string" },
            },
          },
        },
      },
    },
    404: {
      description: "Actor not found",
    },
  },
});

// DELETE /actors/:id
registry.registerPath({
  method: "delete",
  path: "/actors/{id}",
  tags: ["Actors"],
  request: {
    params: uuidParamsSchema,
  },
  responses: {
    200: {
      description: "Actor deleted successfully",
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
    404: {
      description: "Actor not found",
    },
  },
});

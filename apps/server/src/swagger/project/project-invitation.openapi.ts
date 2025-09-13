import { registerMultiple, registry } from "../registry";
import { createProjectInvitationSchema, uuidParamsSchema } from "@repo/shared-schemas";
// Register DTOs
registerMultiple(registry, {
  CreateProjectInvitationDto: createProjectInvitationSchema,
  UuidParamsDto: uuidParamsSchema,
});

registry.registerPath({
  method: "get",
  path: "/project-invitations",
  tags: ["ProjectInvitation"],
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
  path: "/project-invitations/sent",
  tags: ["ProjectInvitation"],
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
  method: "post",
  path: "/project-invitations",
  tags: ["ProjectInvitation"],
  request: {
    body: {
      description: "CreateProjectInvitationDto request body",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/CreateProjectInvitationDto",
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
  method: "patch",
  path: "/project-invitations/{id}/accept",
  tags: ["ProjectInvitation"],
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
  method: "patch",
  path: "/project-invitations/{id}/deny",
  tags: ["ProjectInvitation"],
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
  method: "patch",
  path: "/project-invitations/{id}/cancel",
  tags: ["ProjectInvitation"],
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

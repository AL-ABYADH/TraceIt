import { registerMultiple, registry } from "../registry";
import {
  actorSubtypeActorSchema,
  actorTypeSchema,
  addActorSchema,
  updateActorSchema,
  uuidParamsSchema,
} from "@repo/shared-schemas";
// Register DTOs
registerMultiple(registry, {
  ActorSubtypeActorDto: actorSubtypeActorSchema,
  ActorTypeDto: actorTypeSchema,
  AddActorDto: addActorSchema,
  UpdateActorDto: updateActorSchema,
  UuidParamsDto: uuidParamsSchema,
});

registry.registerPath({
  method: "post",
  path: "/actors",
  tags: ["Actor"],
  request: {
    body: {
      description: "AddActorDto request body",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/AddActorDto",
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
  path: "/actors/subtype/{id}",
  tags: ["Actor"],
  request: {
    params: actorSubtypeActorSchema,
    query: uuidParamsSchema,
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
  path: "/actors/type/{id}",
  tags: ["Actor"],
  request: {
    params: actorTypeSchema,
    query: uuidParamsSchema,
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
  path: "/actors",
  tags: ["Actor"],
  request: {
    query: uuidParamsSchema,
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
  path: "/actors/{id}",
  tags: ["Actor"],
  request: {
    body: {
      description: "UpdateActorDto request body",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UpdateActorDto",
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
  path: "/actors/{id}",
  tags: ["Actor"],
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

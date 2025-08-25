import { registerMultiple, registry } from "../registry";
import { loginSchema, registerSchema } from "@repo/shared-schemas";
// Register DTOs
registerMultiple(registry, {
  LoginDto: loginSchema,
  RegisterDto: registerSchema,
});

registry.registerPath({
  method: "post",
  path: "/auth/register",
  tags: ["Auth"],
  request: {
    body: {
      description: "RegisterDto request body",
      required: true,
      content: {
        "application/json": { schema: { $ref: "#/components/schemas/RegisterDto" } },
      },
    },
  },
  responses: {
    200: { description: "Successful response" },
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/login",
  tags: ["Auth"],
  request: {
    body: {
      description: "LoginDto request body",
      required: true,
      content: {
        "application/json": { schema: { $ref: "#/components/schemas/LoginDto" } },
      },
    },
  },
  responses: {
    200: { description: "Successful response" },
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/logout",
  tags: ["Auth"],

  responses: {
    200: { description: "Successful response" },
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/logout-all",
  tags: ["Auth"],

  responses: {
    200: { description: "Successful response" },
  },
});

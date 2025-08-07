// schemas/project/fields.ts
import { z } from "../zod-openapi-init";

// Permissions
export const permissionNameField = z
  .string()
  .min(3)
  .max(50)
  .regex(/^(?! )[A-Za-z0-9 _-]*(?<! )$/, {
    message:
      "Only letters, numbers, spaces, underscores, hyphens; no leading/trailing spaces.",
  });

export const permissionCodeField = z
  .string()
  .min(2)
  .max(50)
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "Only letters, numbers, and underscores.",
  });

// Roles
export const roleNameField = z
  .string()
  .min(1)
  .max(50)
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "Only letters, numbers, and underscores.",
  });

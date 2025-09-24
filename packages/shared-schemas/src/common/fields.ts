import { z } from "../zod-openapi-init";
import { createEnumField } from "./field-factory";

// ----------------------
// Raw Field Validators (no .openapi())
// ----------------------

export const stringField = z.string();
export const numberField = z.number();
export const booleanField = z.boolean();
export const dateField = z.string();
export const dateISOField = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/);
export const uuidField = z.string().uuid({ message: "Invalid UUID format" });
export const emailField = z
  .string()
  .email({ message: "Invalid email format" })
  .max(254);

// Add the missing field validators
export const urlField = z.string().url({ message: "Invalid URL format" });
export const integerField = z
  .number()
  .int({ message: "Value must be an integer" });

export const arrayField = <T extends z.ZodTypeAny>(
  elementType: T,
): z.ZodArray<T> => z.array(elementType);

// Common fields with validation
export const nameField = stringField.min(1).max(100);
export const descriptionField = stringField.max(500);
export const usernameField = stringField
  .min(3, { message: "Username must be at least 3 characters" })
  .max(20, { message: "Username cannot exceed 20 characters" })
  .regex(/^[a-zA-Z0-9_-]+$/, {
    message:
      "Username can only contain letters, numbers, underscores and hyphens",
  });

export const passwordField = stringField
  .min(8, { message: "Password must be at least 8 characters" })
  .refine(
    (val) =>
      /[a-z]/.test(val) &&
      /[A-Z]/.test(val) &&
      /\d/.test(val) &&
      /[^A-Za-z0-9]/.test(val),
    {
      message:
        "Password must contain uppercase, lowercase, number, and special character",
    },
  );

export const displayNameField = stringField
  .min(1, { message: "Display name must not be empty" })
  .max(50, { message: "Display name must not exceed 50 characters" });

export const loginUsernameField = z
  .string({
    invalid_type_error: "Username must be a string",
  })
  .min(3, { message: "Username must be at least 3 characters" })
  .max(32, { message: "Username cannot exceed 32 characters" })
  .transform((val) => val.trim())
  .optional();

export const emailVerifiedField = z.boolean();

export enum ProjectStatus {
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED",
}

export const ProjectStatusField = createEnumField(ProjectStatus, {
  optional: true,
});
export const requirementIdField = uuidField;
export const exceptionIdField = uuidField;
export const childIdField = uuidField;

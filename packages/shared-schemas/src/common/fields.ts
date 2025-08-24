import { z } from "../zod-openapi-init";

// ----------------------
// Raw Field Validators (no .openapi())
// ----------------------

export const loginUsernameField = z
  .string()
  .optional()
  .transform((val) => val?.trim() || undefined);

export const emailField = z
  .string()
  .email({ message: "Please enter a valid email address" })
  .max(254);

export const usernameField = z
  .string()
  .min(3, { message: "Username must be at least 3 characters long" })
  .max(20, { message: "Username cannot exceed 20 characters" })
  .regex(/^[a-zA-Z0-9_-]+$/, {
    message:
      "Username can only contain letters, numbers, underscores and hyphens",
  });

export const passwordField = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .refine(
    (val) =>
      /[a-z]/.test(val) &&
      /[A-Z]/.test(val) &&
      /\d/.test(val) &&
      /[^A-Za-z0-9]/.test(val),
    {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    },
  );

export const displayNameField = z
  .string()
  .min(1, { message: "The name is required" })
  .max(50);

export const uuidField = z.string().uuid({ message: "Invalid UUID" });

export const nameField = z.string().min(1).max(100);

export const descriptionField = z.string().max(500);

export const dateField = z.date();
export const dateISOField = z.string().min(1).max(1000);

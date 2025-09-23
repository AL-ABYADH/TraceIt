import { createEnumField } from "./field-factory";

import { createField } from "./field-factory";

const NAME_DESC_REGEX = /^(?! )[A-Za-z0-9 _-]*(?<! )$/;

export const dateField = createField("string");

export const urlField = createField("string", {
  message: "Invalid URL format",
});

export const integerField = createField("number", {
  message: "Value must be an integer",
});

export const dateISOField = createField("string", {
  regex: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/,
  message: "Invalid ISO date format",
});

export const uuidField = createField("string", {
  message: "Invalid UUID format",
});

export const emailField = createField("string", {
  max: 254,
  message: "Email must not exceed 254 characters",
});

export const nameField = createField("string", {
  min: 1,
  max: 100,
  regex: NAME_DESC_REGEX,
  message:
    "Name is not valid. Allowed: letters, numbers, spaces, underscores, hyphens.",
});

export const descriptionField = createField("string", {
  min: 3,
  max: 1000,
  regex: NAME_DESC_REGEX,
  message:
    "Description is not valid. Allowed: letters, numbers, spaces, underscores, hyphens; no leading/trailing spaces.",
});

export const usernameField = createField("string", {
  min: 3,
  max: 20,
  regex: /^[a-zA-Z0-9_-]+$/,
  message:
    "Username can only contain letters, numbers, underscores and hyphens",
});

export const passwordField = createField("string", {
  min: 8,
  message: "Password must be at least 8 characters",
}).refine(
  (val: string) =>
    /[a-z]/.test(val) &&
    /[A-Z]/.test(val) &&
    /\d/.test(val) &&
    /[^A-Za-z0-9]/.test(val),
  {
    message:
      "Password must contain uppercase, lowercase, number, and special character",
  },
);

export const displayNameField = createField("string", {
  min: 1,
  max: 50,
  message: "Display name must not exceed 50 characters",
});

export const loginUsernameField = createField("string", {
  min: 3,
  max: 32,
  message: "Username must be between 3 and 32 characters",
})
  .transform((val: string) => (typeof val === "string" ? val.trim() : val))
  .optional();

export const emailVerifiedField = createField("boolean");

export enum ProjectStatus {
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED",
}

export const ProjectStatusField = createEnumField(ProjectStatus);
export const requirementIdField = uuidField;

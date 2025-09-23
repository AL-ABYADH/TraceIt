import {
  booleanField,
  dateField,
  dateISOField,
  descriptionField,
  displayNameField,
  emailField,
  loginUsernameField,
  nameField,
  passwordField,
  ProjectStatus,
  ProjectStatusField,
  requirementIdField,
  usernameField,
  uuidField,
} from "./fields";

export const loginUsernameFieldDoc = loginUsernameField;

export const emailFieldDoc = emailField.openapi({
  example: "user@example.com",
  description: "User's email address",
});

export const usernameFieldDoc = usernameField.openapi({
  example: "user_123",
  description: "Username (3–20 characters)",
});
export const projectIdFieldDoc = uuidField.openapi({
  description:
    "The unique identifier of the project that contains this use case",
  example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
});

export const passwordFieldDoc = passwordField.openapi({
  example: "StrongP@ssw0rd",
  description: "Strong user password",
});

export const displayNameFieldDoc = displayNameField.openapi({
  example: "Saleh Saeed",
  description: "Full name of the user",
});

export const uuidFieldDoc = uuidField.openapi({
  example: "a8d5a4e3-88a9-4a87-bb52-42cfb8b5d0ff",
});

export const nameFieldDoc = nameField.openapi({
  example: "Product name",
});

export const descriptionFieldDoc = descriptionField.openapi({
  example: "This product is...",
});

export const dateFieldDoc = dateField.openapi({
  example: new Date().toISOString(),
});

export const ProjectStatusFieldDoc = ProjectStatusField.openapi({
  example: ProjectStatus.ARCHIVED,
  description: "The status of the project",
});

export const requirementIdFieldDoc = requirementIdField.openapi({
  description: "UUID of the referenced requirement",
  example: "f6a7b8c9-0123-4567-89ab-cdef01234567",
});

export const dateISOFieldDoc = dateISOField.openapi({
  example: new Date().toISOString(),
  description: "ISO 8601 date string",
});

export const booleanFieldDoc = booleanField.openapi({
  example: true,
  description: "Boolean flag",
});

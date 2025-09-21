import {
  loginUsernameField,
  emailField,
  usernameField,
  passwordField,
  displayNameField,
  uuidField,
  nameField,
  descriptionField,
  dateField,
  projectStatusField,
  ProjectStatus,
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

export const projectStatusFieldDoc = projectStatusField.openapi({
  example: ProjectStatus.ARCHIVED,
  description: "The status of the project",
});

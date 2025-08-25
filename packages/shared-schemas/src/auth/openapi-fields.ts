import {
  displayNameField,
  emailField,
  loginUsernameField,
  passwordField,
  usernameField,
} from "../common";

// Registration fields
export const displayNameFieldDoc = displayNameField.openapi({
  example: "Jane Doe",
  description: "Full name of the user",
});

export const emailFieldDoc = emailField.openapi({
  example: "jane@example.com",
  description: "Email address of the user",
});

export const usernameFieldDoc = usernameField.openapi({
  example: "jane_doe",
  description: "Unique username (3–20 characters)",
});

export const passwordFieldDoc = passwordField.openapi({
  example: "Str0ng!Pass",
  description: "Strong password with complexity requirements",
});

// Login fields
export const loginUsernameFieldDoc = loginUsernameField.openapi({
  example: "jane_doe",
  description: "Username (optional alternative to email)",
});

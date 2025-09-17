// @repo/shared/schemas/user/update-user-openapi-fields.ts
import { updateUserFields, userFields } from "./fields";

export const updateUserOpenApiFields = {
  username: updateUserFields.username.openapi({
    description: "Unique username used for login and identification",
    example: "new_user123",
  }),
  displayName: updateUserFields.displayName.openapi({
    description: "Name shown publicly in the app UI",
    example: "Saleh Saeed",
  }),
};

export const userOpenApiFields = {
  id: userFields.id.openapi({
    description: "Unique identifier for the user",
    example: "a8d5a4e3-88a9-4a87-bb52-42cfb8b5d0ff",
  }),
  username: userFields.username.openapi({
    description: "Unique username used for login and identification",
    example: "user_123",
  }),
  password: userFields.password.openapi({
    description: "User's password (hashed and securely stored)",
    example: "$2b$10$7sYz4F2ZQ7y4P0kK1U9aZeYkjs8Zh8pOavFsKlf8XbC9fPqYzB9hy", // example bcrypt hash
  }),
  displayName: userFields.displayName.openapi({
    description: "Name shown publicly in the app UI",
    example: "Saleh Saeed",
  }),
  email: userFields.email.openapi({
    description: "User's email address",
    example: "user@example.com",
  }),
  emailVerified: userFields.emailVerified.openapi({
    description: "Whether the user's email address has been verified",
    example: true,
  }),
  createdAt: userFields.createdAt.openapi({
    description: "The date the user account was created",
    example: new Date().toISOString(),
  }),
};

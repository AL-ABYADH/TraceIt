// @repo/shared/schemas/user/update-user-schema.ts
import { updateUserFields } from "./fields";
import { atLeastOneOfSchema } from "../common";
import { userOpenApiFields } from "./openapi-fields";
import { z } from "../zod-openapi-init";

export const updateUserSchema = atLeastOneOfSchema(updateUserFields, [
  "username",
  "displayName",
]).openapi({
  title: "UpdateUserDto",
  description: "At least one of the fields must be provided to update the user",
});

export const userSchema = z.object(userOpenApiFields).openapi({
  title: "UserDto",
  description: "Represents a user object returned by the API",
});

export const userResponseSchema = userSchema.omit({ password: true });

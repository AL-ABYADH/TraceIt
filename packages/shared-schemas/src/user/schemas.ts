// @repo/shared/schemas/user/update-user-schema.ts
import { z } from "../zod-openapi-init";
import { updateUserFields } from "./fields";
import { atLeastOneOfSchema } from "../common";

export const updateUserSchema = atLeastOneOfSchema(updateUserFields, [
  "username",
  "displayName",
]).openapi({
  title: "UpdateUserDto",
  description: "At least one of the fields must be provided to update the user",
});

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

// // @repo/shared/schemas/user.ts (or wherever this belongs)
// import { z } from "../zod-openapi-init";
// import { usernameField, atLeastOneOfSchema, displayNameField } from "../common";

// export const updateUserSchema = atLeastOneOfSchema(
//   {
//     username: usernameField.openapi({ example: "new_user123" }),
//     displayName: displayNameField.openapi({ example: "Saleh Saeed" }),
//   },
//   ["username", "displayName"]
// ).openapi({ title: "UpdateUserDto" });

// export type UpdateUserDto = z.infer<typeof updateUserSchema>;

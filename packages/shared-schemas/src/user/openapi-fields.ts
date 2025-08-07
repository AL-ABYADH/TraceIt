// @repo/shared/schemas/user/update-user-openapi-fields.ts
import { updateUserFields } from "./fields";

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

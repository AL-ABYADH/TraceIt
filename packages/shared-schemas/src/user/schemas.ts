// @repo/shared/schemas/user/update-user-schema.ts
import { atLeastOneOfSchema, projectSchema } from "../common";
import { updateUserFieldsDoc, userFieldsDoc } from "./openapi-fields";
import { z } from "../zod-openapi-init";

export const updateUserSchema = atLeastOneOfSchema(updateUserFieldsDoc, [
  "username",
  "displayName",
]).openapi({
  title: "UpdateUserDto",
  description: "At least one of the fields must be provided to update the user",
});

export const userListSchema = z.object(userFieldsDoc).openapi({
  title: "UserDto",
  description: "Represents a user object returned by the API",
});

export const userRelationshipsSchema = z
  .object({
    projects: z.array(projectSchema).optional(),
    collaborations: z.any(),
    refreshTokens: z.any(),
  })
  .openapi({ title: "UserRelationships" });

export const userNoPasswordSchema = userListSchema.omit({ password: true });
export const safeUserDetailSchema = userNoPasswordSchema
  .merge(userRelationshipsSchema)
  .openapi({ title: "SafeUserDetailDto" });

export const safeUserListSchema = userNoPasswordSchema.openapi({
  title: "SafeUserListDto",
});

// @repo/shared/schemas/user/update-user-schema.ts
import { updateUserFields } from "./fields";
import { atLeastOneOfSchema, projectListSchema } from "../common";
import { userOpenApiFields } from "./openapi-fields";
import { z } from "../zod-openapi-init";

export const updateUserSchema = atLeastOneOfSchema(updateUserFields, [
  "username",
  "displayName",
]).openapi({
  title: "UpdateUserDto",
  description: "At least one of the fields must be provided to update the user",
});

export const userListSchema = z.object(userOpenApiFields).openapi({
  title: "UserDto",
  description: "Represents a user object returned by the API",
});

export const userRelationshipsSchema = z
  .object({
    projects: z.array(projectListSchema).optional(),
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

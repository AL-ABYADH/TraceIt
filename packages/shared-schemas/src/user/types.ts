// @repo/shared/schemas/user/update-user-type.ts
import { z } from "../zod-openapi-init";
import { safeUserDetailSchema, safeUserListSchema, updateUserSchema, userSchema } from "./schemas";

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type UserDto = z.infer<typeof userSchema>;
export type SafeUserListDto = z.infer<typeof safeUserListSchema>;
export type SafeUserDetailDto = z.infer<typeof safeUserDetailSchema>;

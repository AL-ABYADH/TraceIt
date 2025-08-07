// @repo/shared/schemas/user/update-user-type.ts
import { z } from "../zod-openapi-init";
import { updateUserSchema } from "./schemas";

export type UpdateUserDto = z.infer<typeof updateUserSchema>;

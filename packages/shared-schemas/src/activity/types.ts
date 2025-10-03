import { z } from "../zod-openapi-init";
import {
  activityIdSchema,
  activitySchema,
  conditionIdSchema,
  conditionSchema,
  createActivitySchema,
  createConditionSchema,
  updateActivitySchema,
  updateConditionSchema,
  useCaseOptionalIdSchema,
} from "./schemas";

export type CreateActivityDto = z.infer<typeof createActivitySchema>;
export type UpdateActivityDto = z.infer<typeof updateActivitySchema>;
export type ActivityDto = z.infer<typeof activitySchema>;
export type ActivityIdDto = z.infer<typeof activityIdSchema>;
export type UseCaseOptionalIdDto = z.infer<typeof useCaseOptionalIdSchema>;
export type CreateConditionDto = z.infer<typeof createConditionSchema>;
export type UpdateConditionDto = z.infer<typeof updateConditionSchema>;
export type ConditionDto = z.infer<typeof conditionSchema>;
export type ConditionIdDto = z.infer<typeof conditionIdSchema>;

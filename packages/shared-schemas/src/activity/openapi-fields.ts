import { activityNameField, conditionNameField } from "./fields";

export const activityNameFieldDoc = activityNameField.openapi({
  description: "Name of the activity",
  example: "Validate user credentials",
});
export const conditionNameFieldDoc = conditionNameField.openapi({
  description: "Name of the Condition",
  example: "user has logged in",
});

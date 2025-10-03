import { createField } from "../common";

export const activityNameField = createField("string", {
  min: 1,
  minMessage: "Activity name is required",
  max: 100,
  maxMessage: "Activity name must not exceed 100 characters",
});
export const conditionNameField = createField("string", {
  min: 1,
  minMessage: "Activity name is required",
  max: 100,
  maxMessage: "Activity name must not exceed 100 characters",
});

import { createEnumField, createField } from "../common/field-factory";

export const subTypeEnum = createEnumField([
  "human",
  "software",
  "hardware",
  "event",
  "ai-agent",
]);

export const actorNameField = createField("string", {
  min: 1,
  max: 50,
  regex: /^(?! )[A-Za-z0-9 _-]*(?<! )$/,
  message:
    "is not a valid name. It can only contain letters, numbers, spaces, underscores, hyphens, and no leading or trailing spaces.",
});

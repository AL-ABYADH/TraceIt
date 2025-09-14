import { createEnumField, createField } from "../common";
import { z } from "../zod-openapi-init";

export const actorSubTypeEnum = createEnumField([
  "human",
  "software",
  "hardware",
  "event",
  "ai-agent",
]);

export const actorTypeEnum = createEnumField(["actual", "virtual"]);

export const actorNameField = createField("string", {
  min: 1,
  max: 50,
  regex: /^(?! )[A-Za-z0-9 _-]*(?<! )$/,
  message:
    "is not a valid name. It can only contain letters, numbers, spaces, underscores, hyphens, and no leading or trailing spaces.",
});

export const actorTypeVirtual = z.literal("virtual").openapi({
  description: "Actor type must be 'virtual' for event actors",
  example: "virtual",
});

export const actorSubTypeEvent = z.literal("event").openapi({
  description: "Actor subtype must be 'event' for event actors",
  example: "event",
});

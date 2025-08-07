import { z } from "../zod-openapi-init";

// Subtype enum (raw version)
export const subTypeEnum = z.enum([
  "human",
  "software",
  "hardware",
  "event",
  "ai-agent",
]);

// Regex pattern & validation message for names
export const actorNameRegex = /^(?! )[A-Za-z0-9 _-]*(?<! )$/;

export const actorNameField = z.string().min(1).max(50).regex(actorNameRegex, {
  message:
    "is not a valid name. It can only contain letters, numbers, spaces, underscores, hyphens, and no leading or trailing spaces.",
});

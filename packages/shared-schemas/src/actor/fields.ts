import { createEnumField, createField } from "../common";
import { z } from "../zod-openapi-init";

export enum ActorSubtype {
  HUMAN = "human",
  SOFTWARE = "software",
  HARDWARE = "hardware",
  EVENT = "event",
  AI_AGENT = "ai-agent",
}

export const ActorSubtypeField = createEnumField(ActorSubtype);

export enum ActorType {
  ACTUAL = "actual",
  VIRTUAL = "virtual",
}
export const ActorTypeField = createEnumField(ActorType);
// export const actorTypeEnum = createEnumField(["actual", "virtual"]);

export const actorNameField = createField("string", {
  min: 1,
  max: 50,
  regex: /^(?! )[A-Za-z0-9 _-]*(?<! )$/,
  message:
    "is not a valid name. It can only contain letters, numbers, spaces, underscores, hyphens, and no leading or trailing spaces.",
});

export const actorTypeVirtual = z.literal(ActorType.VIRTUAL).openapi({
  description: "Actor type must be 'virtual' for event actors",
  example: ActorType.VIRTUAL,
});

export const actorSubTypeEvent = z.literal(ActorSubtype.EVENT).openapi({
  description: "Actor subtype must be 'event' for event actors",
  example: ActorSubtype.EVENT,
});

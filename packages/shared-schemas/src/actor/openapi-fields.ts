import { uuidField } from "../common";
import { actorSubTypeEnum, actorNameField, actorTypeEnum } from "./fields";

// Apply .openapi descriptions and examples

export const actorSubTypeEnumDoc = actorSubTypeEnum.openapi({
  description: "The subtype of the actor",
  example: "software",
});

export const actorTypeEnumDoc = actorTypeEnum.openapi({
  description: "The type of the actor",
  example: "virtual",
});

export const actorNameFieldDoc = actorNameField.openapi({
  description: "Actor name (no leading/trailing spaces)",
  example: "Admin Agent",
});

export const updatedActorNameFieldDoc = actorNameField.openapi({
  description: "Updated name of the actor",
  example: "Updated Actor Name",
});

export const actorProjectIdField = uuidField.openapi({
  description: "UUID of the project this actor belongs to",
});

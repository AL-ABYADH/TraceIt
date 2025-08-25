import { uuidField } from "../common";
import { subTypeEnum, actorNameField } from "./fields";

// Apply .openapi descriptions and examples

export const subTypeEnumDoc = subTypeEnum.openapi({
  description: "The subtype of the actor",
  example: "software",
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

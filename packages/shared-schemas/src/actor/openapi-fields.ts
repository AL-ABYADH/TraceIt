import { uuidField, createField } from "../common";
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

export const actorIdFieldDoc = uuidField.openapi({
  description: "UUID of the actor",
  example: "158bd736-1e92-4caa-94bf-c5bc5ba4af87",
});

export const actorCreatedAtFieldDoc = createField("date").openapi({
  description: "Creation timestamp of the actor",
  example: "2025-09-12T07:24:50.999Z",
});

export const actorUpdatedAtFieldDoc = createField("date").openapi({
  description: "Last updated timestamp of the actor",
  example: "2025-09-12T07:24:50.999Z",
});

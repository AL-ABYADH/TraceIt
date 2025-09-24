import { createField } from "../common";

export const modelsList = createField("array", {
  elementType: createField("string", {
    enum: [
      "Actor",
      "Requirement",
      "Project",
      "UseCase",
      "User",
      "ProjectCollaboration",
      "ProjectRole",
      "SecondaryUseCase",
      "primaryActors",
      "requirements",
    ],
  }),
  description: "List of model names",
});

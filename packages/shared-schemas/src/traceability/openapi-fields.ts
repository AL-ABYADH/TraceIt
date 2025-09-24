import { modelsList } from "./fields";

export const modelsListDoc = modelsList.openapi({
  description: "List of model names",
  example: ["Actor", "Requirement", "Project", "UseCase", "User"],
});

// File: models/use-case-description.model.ts
import { defineModelFactory, ModelFactoryDefinition, NeogmaModel } from "@repo/custom-neogma";
import { UseCaseModel, UseCaseAttributes, UseCaseRelationships } from "./use-case.model";
import { UseCaseImportanceLevel } from "../enums/use-case-importance-level.enum";

export interface UseCaseDescriptionAttributes extends UseCaseAttributes {
  useCaseId: string;
  importanceLevel: UseCaseImportanceLevel;
  briefDescription: string;
}

interface UseCaseDescriptionRelationships extends UseCaseRelationships {
  useCase: any;
}

export type UseCaseDescriptionModelType = NeogmaModel<
  UseCaseDescriptionAttributes,
  UseCaseDescriptionRelationships
>;

export const UseCaseDescriptionModel: ModelFactoryDefinition<
  UseCaseDescriptionAttributes,
  UseCaseDescriptionRelationships
> = defineModelFactory<UseCaseDescriptionAttributes, UseCaseDescriptionRelationships>({
  name: "UseCaseDescription",
  label: [...UseCaseModel.parameters.label, "UseCaseDescription"],
  schema: {
    useCaseId: { type: "string", required: true },
    importanceLevel: { type: "string", required: true, enum: UseCaseImportanceLevel },
    briefDescription: { type: "string", required: true },
  },
  relationships: {
    useCase: {
      model: "PrimaryUseCase",
      direction: "out",
      name: "DESCRIBES",
      cardinality: "one",
    },
  },
});

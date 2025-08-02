import { defineModelFactory, ModelFactoryDefinition, NeogmaModel } from "@repo/custom-neogma";
import { UseCaseAttributes, UseCaseModel, UseCaseRelationships } from "./use-case.model";
import { UseCaseDescription } from "../entities/use-case-description.entity";

export type PrimaryUseCaseAttributes = UseCaseAttributes & {
  briefDescription?: string;
  number: number;
};

export interface PrimaryUseCaseRelationships extends UseCaseRelationships {
  useCaseDescription: UseCaseDescription;
  secondaryUseCases: UseCaseDescription;
}

export type PrimaryUseCaseModelType = NeogmaModel<
  PrimaryUseCaseAttributes,
  PrimaryUseCaseRelationships
>;

export const PrimaryUseCaseModel: ModelFactoryDefinition<
  PrimaryUseCaseAttributes,
  PrimaryUseCaseRelationships
> = defineModelFactory<PrimaryUseCaseAttributes, PrimaryUseCaseRelationships>({
  name: "PrimaryUseCase",
  label: [...UseCaseModel.parameters.label, "PrimaryUseCase"],
  schema: {
    ...UseCaseModel.parameters.schema,
    briefDescription: { type: "string", required: false },
    number: { type: "number", required: true },
  },
  relationships: {
    ...UseCaseModel.parameters.relationships,
    useCaseDescription: {
      model: "UseCaseDescription",
      direction: "out",
      name: "HAS_DESCRIPTION",
      cardinality: "one",
    },
    secondaryUseCases: {
      model: "SecondaryUseCase",
      direction: "out",
      name: "HAS_SECONDARY",
      cardinality: "many",
    },
  },
});

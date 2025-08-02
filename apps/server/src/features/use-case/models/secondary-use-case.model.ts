import { defineModelFactory, ModelFactoryDefinition, NeogmaModel } from "@repo/custom-neogma";
import { UseCaseModel } from "./use-case.model";
import { PrimaryUseCase } from "../entities/primary-use-case.entity";

export type SecondaryUseCaseAttributes = {
  id: string;
};

interface SecondaryUseCaseRelationships {
  primaryUseCase: PrimaryUseCase;
}

export type SecondaryUseCaseModelType = NeogmaModel<
  SecondaryUseCaseAttributes,
  SecondaryUseCaseRelationships
>;

export const SecondaryUseCaseModel: ModelFactoryDefinition<
  SecondaryUseCaseAttributes,
  SecondaryUseCaseRelationships
> = defineModelFactory<SecondaryUseCaseAttributes, SecondaryUseCaseRelationships>({
  name: "SecondaryUseCase",
  label: [...UseCaseModel.parameters.label, "SecondaryUseCase"],
  schema: {},
  relationships: {
    primaryUseCase: {
      model: "PrimaryUseCase",
      direction: "in",
      name: "HAS_SECONDARY",
      cardinality: "one",
    },
  },
});

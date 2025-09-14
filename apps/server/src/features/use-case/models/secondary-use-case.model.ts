import { defineModelFactory, ModelFactoryDefinition, NeogmaModel } from "@repo/custom-neogma";
import { UseCaseModel, UseCaseAttributes, UseCaseRelationships } from "./use-case.model";
 import { PrimaryUseCase } from "../entities/primary-use-case.entity";

/**
 * SecondaryUseCase shares the same attributes as a base UseCase (id, name).
 */
export type SecondaryUseCaseAttributes = UseCaseAttributes & {};

/**
 * Defines relationships for SecondaryUseCase.
 * Each SecondaryUseCase belongs to one PrimaryUseCase.
 */
export interface SecondaryUseCaseRelationships extends UseCaseRelationships {
  // primaryUseCase: PrimaryUseCaseModelType;  I updated this for schema sake!!!
  primaryUseCase: PrimaryUseCase;
}

/**
 * Neogma model type for SecondaryUseCase.
 */
export type SecondaryUseCaseModelType = NeogmaModel<
  SecondaryUseCaseAttributes,
  SecondaryUseCaseRelationships
>;

/**
 * Neogma model factory definition for SecondaryUseCase.
 * Inherits schema and labels from UseCaseModel while adding a specific relationship
 * to its owning PrimaryUseCase.
 */
export const SecondaryUseCaseModel: ModelFactoryDefinition<
  SecondaryUseCaseAttributes,
  SecondaryUseCaseRelationships
> = defineModelFactory<SecondaryUseCaseAttributes, SecondaryUseCaseRelationships>({
  name: "SecondaryUseCase",
  label: [...UseCaseModel.parameters.label, "SecondaryUseCase"],
  schema: {
    ...UseCaseModel.parameters.schema,
  },
  relationships: {
    ...UseCaseModel.parameters.relationships,
    primaryUseCase: {
      model: "PrimaryUseCase",
      direction: "out",
      name: "BELONGS_TO",
      cardinality: "one",
    },
  },
});

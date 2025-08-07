// File: models/secondary-use-case.model.ts

import { defineModelFactory, ModelFactoryDefinition, NeogmaModel } from "@repo/custom-neogma";
import { UseCaseModel, UseCaseAttributes } from "./use-case.model";
import { PrimaryUseCaseModelType } from "./primary-use-case.model"; // Use model type, not entity

/**
 * SecondaryUseCase shares the same attributes as a base UseCase (id, name).
 */
export type SecondaryUseCaseAttributes = UseCaseAttributes;

/**
 * Defines relationships for SecondaryUseCase.
 * Each SecondaryUseCase belongs to one PrimaryUseCase.
 */
interface SecondaryUseCaseRelationships {
  primaryUseCase: PrimaryUseCaseModelType;
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
    primaryUseCase: {
      model: "PrimaryUseCase",
      direction: "in",
      name: "HAS_SECONDARY",
      cardinality: "one",
    },
  },
});

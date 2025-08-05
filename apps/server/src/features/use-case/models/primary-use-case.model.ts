import { defineModelFactory, ModelFactoryDefinition, NeogmaModel } from "@repo/custom-neogma";
import { UseCaseModel, UseCaseAttributes, UseCaseRelationships } from "./use-case.model";
import { UseCaseDescription } from "../entities/use-case-description.entity";
import { UseCaseActor } from "../entities/use-case-actor.entity";
import { SecondaryUseCase } from "../entities/secondary-use-case.entity";

/**
 * Attributes for the PrimaryUseCase entity, extending the base UseCase attributes.
 */
export type PrimaryUseCaseAttributes = UseCaseAttributes & {
  briefDescription?: string;
  number: number;
};

/**
 * Relationship definitions for the PrimaryUseCase entity.
 */
export interface PrimaryUseCaseRelationships extends UseCaseRelationships {
  useCaseDescription: UseCaseDescription;
  secondaryUseCases: SecondaryUseCase;
  actors: UseCaseActor; // New relationship to associate involved actors
}

/**
 * Neogma model type for PrimaryUseCase.
 */
export type PrimaryUseCaseModelType = NeogmaModel<
  PrimaryUseCaseAttributes,
  PrimaryUseCaseRelationships
>;

/**
 * Neogma model factory definition for the PrimaryUseCase entity.
 */
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
    actors: {
      model: "UseCaseActor",
      direction: "out",
      name: "HAS_ACTOR",
      cardinality: "many",
    },
  },
});

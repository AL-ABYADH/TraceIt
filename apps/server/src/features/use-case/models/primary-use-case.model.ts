import { defineModelFactory, ModelFactoryDefinition, NeogmaModel } from "@repo/custom-neogma";
import { UseCaseModel, UseCaseAttributes, UseCaseRelationships } from "./use-case.model";
import { UseCaseActor } from "../entities/use-case-actor.entity";
import { SecondaryUseCase } from "../entities/secondary-use-case.entity";
import { Class } from "src/features/class/entities/class.entity";

/**
 * Attributes for the PrimaryUseCase entity, extending the base UseCase attributes.
 */
export type PrimaryUseCaseAttributes = UseCaseAttributes & {
  description?: string;
};

/**
 * Relationship definitions for the PrimaryUseCase entity.
 */
export interface PrimaryUseCaseRelationships extends UseCaseRelationships {
  secondaryUseCases: SecondaryUseCase[];
  actors: UseCaseActor[];
  classes: Class[];
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
    description: { type: "string", required: false },
  },
  relationships: {
    ...UseCaseModel.parameters.relationships,
    secondaryUseCases: {
      model: "SecondaryUseCase",
      direction: "in",
      name: "BELONGS_TO",
      cardinality: "one",
    },
    actors: {
      model: "UseCaseActor",
      direction: "out",
      name: "HAS_ACTOR",
      cardinality: "many",
    },
    classes: {
      model: "Class",
      direction: "out",
      name: "HAS_CLASS",
      cardinality: "many",
    },
  },
});

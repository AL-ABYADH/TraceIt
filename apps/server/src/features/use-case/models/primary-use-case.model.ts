import { defineModelFactory, ModelFactoryDefinition, NeogmaModel } from "@repo/custom-neogma";
import { UseCaseModel, UseCaseAttributes, UseCaseRelationships } from "./use-case.model";
import { ActorAttributes } from "../../actor/models/actor.model";
import { SecondaryUseCaseAttributes } from "./secondary-use-case.model";

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
  primaryActors: ActorAttributes[];
  secondaryActors: ActorAttributes[];
  secondaryUseCases: SecondaryUseCaseAttributes[];
  // classes: Class[];
  classes: any;
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
    primaryActors: {
      model: "Actor",
      direction: "out",
      name: "HAS_PRIMARY_ACTOR",
      cardinality: "many",
    },
    secondaryActors: {
      model: "Actor",
      direction: "out",
      name: "HAS_SECONDARY_ACTOR",
      cardinality: "many",
    },
    secondaryUseCases: {
      model: "SecondaryUseCase",
      direction: "in",
      name: "BELONGS_TO",
      cardinality: "one",
    },
    // classes: {
    //   model: "Class",
    //   direction: "out",
    //   name: "HAS_CLASS",
    //   cardinality: "many",
    // },
  },
});

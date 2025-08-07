import { defineModelFactory, ModelFactoryDefinition, NeogmaModel } from "@repo/custom-neogma";
import { UseCaseActorType } from "../enums/use-case-actor-type.enum";

/**
 * Defines the attributes for a UseCaseActor entity in the database.
 * This entity is no longer considered a subtype of UseCase, as it plays an auxiliary role.
 */
export type UseCaseActorAttributes = {
  id: string; // Unique identifier for the actor relationship
  type: UseCaseActorType; // Role type (PRIMARY or SECONDARY)
};

/**
 * Defines the relationships for the UseCaseActor entity.
 * Typically connects to a PrimaryUseCase via the ASSIGNED_TO relationship.
 */
export interface UseCaseActorRelationships {
  useCase: any; // Associated use case (usually a PrimaryUseCase)
}

/**
 * Neogma model type for the UseCaseActor entity.
 */
export type UseCaseActorModelType = NeogmaModel<UseCaseActorAttributes, UseCaseActorRelationships>;

/**
 * Neogma model factory definition for the UseCaseActor entity.
 */
export const UseCaseActorModel: ModelFactoryDefinition<
  UseCaseActorAttributes,
  UseCaseActorRelationships
> = defineModelFactory<UseCaseActorAttributes, UseCaseActorRelationships>({
  name: "UseCaseActor",
  label: ["UseCaseActor"],
  schema: {
    type: {
      type: "string",
      required: true,
      enum: UseCaseActorType, // Ensures only allowed actor types are stored
    },
  },
  relationships: {
    useCase: {
      model: "UseCase",
      direction: "out",
      name: "ASSIGNED_TO",
      cardinality: "one",
    },
  },
});

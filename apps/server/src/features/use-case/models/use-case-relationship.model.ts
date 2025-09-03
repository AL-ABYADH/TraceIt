import { defineModelFactory, ModelFactoryDefinition, NeogmaModel } from "@repo/custom-neogma";
import { UseCaseRelationshipType } from "../enums/use-case-relationship-type.enum";
import { UseCase } from "../entities/use-case.entity";

/**
 * Defines the model for a relationship between use cases (e.g., INCLUDES, EXTENDS).
 * This is not a subtype of UseCaseModel, but an auxiliary entity linking two use cases.
 */
export type UseCaseRelationshipAttributes = {
  id: string;
  type: UseCaseRelationshipType;
};

/**
 * Defines relationships for the UseCaseRelationship model.
 * Links to the target use case involved in the relationship.
 */
export interface UseCaseRelationshipRelationships {
  relatedUseCase: UseCase;
}

/**
 * Neogma model type for UseCaseRelationship.
 */
export type UseCaseRelationshipModelType = NeogmaModel<
  UseCaseRelationshipAttributes,
  UseCaseRelationshipRelationships
>;

/**
 * Neogma model factory definition for UseCaseRelationship.
 */
export const UseCaseRelationshipModel: ModelFactoryDefinition<
  UseCaseRelationshipAttributes,
  UseCaseRelationshipRelationships
> = defineModelFactory<UseCaseRelationshipAttributes, UseCaseRelationshipRelationships>({
  name: "UseCaseRelationship",
  label: ["UseCaseRelationship"],
  schema: {
    type: {
      type: "string",
      required: true,
      enum: UseCaseRelationshipType,
    },
  },
  relationships: {
    relatedUseCase: {
      model: "UseCase",
      direction: "out",
      name: "RELATES",
      cardinality: "one",
    },
  },
});

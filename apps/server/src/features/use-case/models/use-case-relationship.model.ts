import { defineModelFactory, ModelFactoryDefinition, NeogmaModel } from "@repo/custom-neogma";
import { UseCaseModel, UseCaseAttributes, UseCaseRelationships } from "./use-case.model";
import { UseCaseRelationshipType } from "../enums/use-case-relationship-type.enum";
import { UseCase } from "../entities/use-case.entity";

export type UseCaseRelationshipAttributes = UseCaseAttributes & {
  type: UseCaseRelationshipType;
};

interface UseCaseRelationshipRelationships extends UseCaseRelationships {
  relatedUseCase: UseCase;
}

export type UseCaseRelationshipModelType = NeogmaModel<
  UseCaseRelationshipAttributes,
  UseCaseRelationshipRelationships
>;

export const UseCaseRelationshipModel: ModelFactoryDefinition<
  UseCaseRelationshipAttributes,
  UseCaseRelationshipRelationships
> = defineModelFactory<UseCaseRelationshipAttributes, UseCaseRelationshipRelationships>({
  name: "UseCaseRelationship",
  label: [...UseCaseModel.parameters.label, "UseCaseRelationship"],
  schema: {
    type: { type: "string", required: true, enum: UseCaseRelationshipType },
  },
  relationships: {
    ...UseCaseModel.parameters.relationships,
    relatedUseCase: {
      model: "UseCase",
      direction: "out",
      name: "RELATED_TO",
      cardinality: "one",
    },
  },
});

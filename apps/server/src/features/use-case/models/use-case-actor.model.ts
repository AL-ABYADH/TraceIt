import { defineModelFactory, ModelFactoryDefinition, NeogmaModel } from "@repo/custom-neogma";
import { UseCaseModel, UseCaseAttributes, UseCaseRelationships } from "./use-case.model";
import { UseCaseActorType } from "../enums/use-case-actor-type.enum";

export type UseCaseActorAttributes = UseCaseAttributes & {
  type: UseCaseActorType;
};

interface UseCaseActorRelationships extends UseCaseRelationships {
  useCase: any;
}

export type UseCaseActorModelType = NeogmaModel<UseCaseActorAttributes, UseCaseActorRelationships>;

export const UseCaseActorModel: ModelFactoryDefinition<
  UseCaseActorAttributes,
  UseCaseActorRelationships
> = defineModelFactory<UseCaseActorAttributes, UseCaseActorRelationships>({
  name: "UseCaseActor",
  label: [...UseCaseModel.parameters.label, "UseCaseActor"],
  schema: {
    type: { type: "string", required: true, enum: UseCaseActorType },
  },
  relationships: {
    ...UseCaseModel.parameters.relationships,
    useCase: {
      model: "UseCase",
      direction: "out",
      name: "ASSIGNED_TO",
      cardinality: "one",
    },
  },
});

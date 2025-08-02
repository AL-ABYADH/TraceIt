import { defineModelFactory, ModelFactoryDefinition, NeogmaModel } from "@repo/custom-neogma";
import { UseCaseModel, UseCaseAttributes, UseCaseRelationships } from "./use-case.model";
import { UseCase } from "../entities/use-case.entity";
import { Actor } from "../../actor/entities/actor.entity";

export type UseCaseDiagramAttributes = UseCaseAttributes & {
  initial: string;
  final?: string;
};

interface UseCaseDiagramRelationships extends UseCaseRelationships {
  useCases: UseCase;
  actors: Actor;
}

export type UseCaseDiagramModelType = NeogmaModel<
  UseCaseDiagramAttributes,
  UseCaseDiagramRelationships
>;

export const UseCaseDiagramModel: ModelFactoryDefinition<
  UseCaseDiagramAttributes,
  UseCaseDiagramRelationships
> = defineModelFactory<UseCaseDiagramAttributes, UseCaseDiagramRelationships>({
  name: "UseCaseDiagram",
  label: [...UseCaseModel.parameters.label, "UseCaseDiagram"],
  schema: {
    initial: { type: "string", required: true },
    final: { type: "string", required: false },
  },
  relationships: {
    useCases: {
      model: "UseCase",
      direction: "out",
      name: "INCLUDES_CASE",
      cardinality: "many",
    },
    actors: {
      model: "UseCaseActor",
      direction: "out",
      name: "INCLUDES_ACTOR",
      cardinality: "many",
    },
  },
});

import { defineModelFactory, ModelFactoryDefinition, NeogmaModel } from "@repo/custom-neogma";
import { UseCaseModelType } from "./use-case.model"; // Adjust path if needed
import { UseCaseActorModelType } from "./use-case-actor.model"; // Adjust path if needed

/**
 * Defines the model for a use case diagram in the database.
 * This is not a subtype of UseCaseModel, as diagrams are structural aggregations.
 */
export type UseCaseDiagramAttributes = {
  id: string;
  initial: string;
  final?: string;
};

/**
 * Defines relationships for the UseCaseDiagram model.
 * Includes a collection of use cases and associated actors.
 */
export interface UseCaseDiagramRelationships {
  useCases: UseCaseModelType;
  actors: UseCaseActorModelType;
}

/**
 * Neogma model type for UseCaseDiagram.
 */
export type UseCaseDiagramModelType = NeogmaModel<
  UseCaseDiagramAttributes,
  UseCaseDiagramRelationships
>;

/**
 * Neogma model factory definition for UseCaseDiagram.
 */
export const UseCaseDiagramModel: ModelFactoryDefinition<
  UseCaseDiagramAttributes,
  UseCaseDiagramRelationships
> = defineModelFactory<UseCaseDiagramAttributes, UseCaseDiagramRelationships>({
  name: "UseCaseDiagram",
  label: ["UseCaseDiagram"],
  schema: {
    initial: { type: "string", required: true },
    final: { type: "string", required: false },
  },
  relationships: {
    useCases: {
      model: "UseCase",
      direction: "out",
      name: "INCLUDES_USE_CASE",
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

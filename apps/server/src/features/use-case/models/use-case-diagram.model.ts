import { defineModelFactory, ModelFactoryDefinition, NeogmaModel } from "@repo/custom-neogma";
import { UseCaseAttributes } from "./use-case.model"; // Adjust path if needed
import { ActorAttributes } from "../../actor/models/actor.model";
import { ProjectAttributes } from "../../project/models/project.model"; // Adjust path if needed

/**
 * Defines the model for a use case diagram in the database.
 * This is not a subtype of UseCaseModel, as diagrams are structural aggregations.
 */
export type UseCaseDiagramAttributes = {
  id: string;
  initial: string;
  final?: string;
  createdAt: string;
  updatedAt?: string;
};

/**
 * Defines relationships for the UseCaseDiagram model.
 * Includes a collection of use cases and associated actors.
 */
export interface UseCaseDiagramRelationships {
  useCases: UseCaseAttributes;
  project: ProjectAttributes;
  actors: ActorAttributes;
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
    project: {
      model: "Project",
      direction: "out",
      name: "BELONGS_TO_PROJECT",
      cardinality: "one",
    },
    useCases: {
      model: "UseCase",
      direction: "out",
      name: "INCLUDES_USE_CASE",
      cardinality: "many",
    },
    actors: {
      model: "Actor",
      direction: "out",
      name: "INCLUDES_ACTOR",
      cardinality: "many",
    },
  },
});

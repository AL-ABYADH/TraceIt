import { defineModelFactory, ModelFactoryDefinition, NeogmaModel } from "@repo/custom-neogma";
import { UseCaseImportanceLevel } from "../enums/use-case-importance-level.enum";
import { PrimaryUseCaseModelType } from "./primary-use-case.model"; // Adjust path if needed

/**
 * Defines the database model for a use case description.
 * This is not a subtype of UseCaseModel, as UseCaseDescription is not itself a use case.
 */
export type UseCaseDescriptionAttributes = {
  id: string; // Unique identifier for the description entity
  useCaseId: string; // Foreign reference to the associated use case (redundant but useful)
  importanceLevel: UseCaseImportanceLevel; // Indicates the priority/criticality of the use case
  briefDescription: string; // A short textual summary of the use case
};

/**
 * Defines relationships for the UseCaseDescription model.
 * Typically connects to a PrimaryUseCase via a DESCRIBES relationship.
 */
export interface UseCaseDescriptionRelationships {
  useCase: PrimaryUseCaseModelType;
}

/**
 * Neogma model type for UseCaseDescription.
 */
export type UseCaseDescriptionModelType = NeogmaModel<
  UseCaseDescriptionAttributes,
  UseCaseDescriptionRelationships
>;

/**
 * Neogma model factory definition for UseCaseDescription.
 */
export const UseCaseDescriptionModel: ModelFactoryDefinition<
  UseCaseDescriptionAttributes,
  UseCaseDescriptionRelationships
> = defineModelFactory<UseCaseDescriptionAttributes, UseCaseDescriptionRelationships>({
  name: "UseCaseDescription",
  label: ["UseCaseDescription"],
  schema: {
    useCaseId: { type: "string", required: true },
    importanceLevel: {
      type: "string",
      required: true,
      enum: UseCaseImportanceLevel,
    },
    briefDescription: { type: "string", required: true },
  },
  relationships: {
    useCase: {
      model: "PrimaryUseCase",
      direction: "out",
      name: "DESCRIBES",
      cardinality: "one",
    },
  },
});

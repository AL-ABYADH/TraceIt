import {
  AbstractModelFactoryDefinition,
  AbstractNeogmaModel,
  defineAbstractModelFactory,
} from "@repo/custom-neogma";
import { Project } from "../../project/entities/project.entity";

export type UseCaseAttributes = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
};

export interface UseCaseRelationships {
  project: Project;
  // requirements: Requirement[];
  requirements: any;
  includedUseCases: UseCaseAttributes[];
  extendedUseCases: UseCaseAttributes[];
}

export type UseCaseModelType = AbstractNeogmaModel<UseCaseAttributes, UseCaseRelationships>;

export const UseCaseModel: AbstractModelFactoryDefinition<UseCaseAttributes, UseCaseRelationships> =
  defineAbstractModelFactory<UseCaseAttributes, UseCaseRelationships>({
    name: "UseCase",
    label: ["UseCase"],
    schema: {
      name: {
        type: "string",
        required: true,
        minLength: 1,
        maxLength: 100,
        pattern: "^(?! )[A-Za-z0-9 _-]*(?<! )$",
        message: "is not a valid use case name.",
      },
    },
    relationships: {
      project: {
        model: "Project",
        direction: "out",
        name: "BELONGS_TO",
        cardinality: "one",
      },
      // requirements: {
      //   model: "Requirement",
      //   direction: "out",
      //   name: "HAS_REQUIREMENT",
      //   cardinality: "many",
      // },
      includedUseCases: {
        model: "self",
        direction: "out",
        name: "INCLUDES",
        cardinality: "many",
      },
      extendedUseCases: {
        model: "self",
        direction: "out",
        name: "EXTENDS",
        cardinality: "many",
      },
    },
  });

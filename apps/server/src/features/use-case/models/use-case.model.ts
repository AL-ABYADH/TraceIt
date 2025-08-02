import {
  defineAbstractModelFactory,
  AbstractNeogmaModel,
  AbstractModelFactoryDefinition,
} from "@repo/custom-neogma";
import { Project } from "../../project/entities/project.entity";

export type UseCaseAttributes = {
  id: string;
  name: string;

  [key: string]: any;
};

export interface UseCaseRelationships {
  project: Project;
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
    },
  });

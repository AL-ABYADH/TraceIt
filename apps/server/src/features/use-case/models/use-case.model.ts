import {
  defineAbstractModelFactory,
  AbstractNeogmaModel,
  AbstractModelFactoryDefinition,
} from "@repo/custom-neogma";
import { Project } from "../../project/entities/project.entity";
import { Requirement } from "src/features/requirement/entities/requirement.entity";
import { UseCaseRelationship } from "../entities/use-case-relationship.entity";

export type UseCaseAttributes = {
  id: string;
  name: string;
  useCaseId: string;

  [key: string]: any;
};

export interface UseCaseRelationships {
  project: Project;
  requirements: Requirement[];
  relationships: UseCaseRelationship[];
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
      useCaseId: {
        type: "string",
        required: true,
        minLength: 3,
        pattern: "^UC[1-9][0-9]*$",
        message: "is not a valid use case id.",
      },
    },
    relationships: {
      project: {
        model: "Project",
        direction: "out",
        name: "BELONGS_TO",
        cardinality: "one",
      },
      requirements: {
        model: "Requirement",
        direction: "out",
        name: "HAS_REQUIREMENT",
        cardinality: "many",
      },
      relationships: {
        model: "UseCaseRelationship",
        direction: "out",
        name: "HAS_RELATIONSHIP",
        cardinality: "many",
      },
    },
  });

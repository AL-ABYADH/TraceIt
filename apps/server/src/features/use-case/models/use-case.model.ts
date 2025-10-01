import {
  AbstractModelFactoryDefinition,
  AbstractNeogmaModel,
  defineAbstractModelFactory,
} from "@repo/custom-neogma";
import { UseCaseSubtype } from "@repo/shared-schemas";
import { DiagramAttributes } from "../../diagram/models/diagram.model";
import { ProjectAttributes } from "../../project/models/project.model";
import { RequirementAttributes } from "../../requirement/models/requirement.model";

export type UseCaseAttributes = {
  id: string;
  name: string;
  subtype: UseCaseSubtype;
  createdAt: string;
  updatedAt?: string;
};

export interface UseCaseRelationships {
  project: ProjectAttributes;
  requirements: RequirementAttributes[];
  includedUseCases: UseCaseAttributes[];
  extendedUseCases: UseCaseAttributes[];
  activityDiagrams: DiagramAttributes[];
  useCaseDiagram: DiagramAttributes;
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
      subtype: {
        type: "string",
        required: true,
        enum: Object.values(UseCaseSubtype),
        message: "must be a valid use case subtype.",
      },
    },
    relationships: {
      project: {
        model: "Project",
        direction: "in",
        name: "BELONGS_TO",
        cardinality: "one",
      },
      requirements: {
        model: "Requirement",
        direction: "out",
        name: "HAS_REQUIREMENT",
        cardinality: "many",
      },
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
      activityDiagrams: {
        model: "Diagram",
        direction: "in",
        name: "RELATED_TO",
        cardinality: "many",
      },
      useCaseDiagram: {
        model: "Diagram",
        direction: "out",
        name: "RELATED_TO",
        cardinality: "many",
      },
    },
  });

import { defineModelFactory, ModelFactoryDefinition, NeogmaModel } from "@repo/custom-neogma";
import { RequirementAttributes } from "src/features/requirement/models/requirement.model";
import { UseCaseAttributes } from "src/features/use-case/models/use-case.model";

export type ActivityAttributes = {
  id: string;
  name: string;
  requirementUpdated: boolean;
  createdAt: string;
  updatedAt?: string;
};

export interface ActivityRelationships {
  requirement: RequirementAttributes;
  useCase: UseCaseAttributes;
}

export type ActivityModelType = NeogmaModel<ActivityAttributes, ActivityRelationships>;

export const ActivityModel: ModelFactoryDefinition<ActivityAttributes, ActivityRelationships> =
  defineModelFactory<ActivityAttributes, ActivityRelationships>({
    name: "Activity",
    label: ["Activity"],
    schema: {
      name: {
        type: "string",
        required: true,
        minLength: 1,
        maxLength: 100,
        allowEmpty: false,
        message: "Activity name must be between 1 and 100 characters",
      },
      requirementUpdated: {
        type: "boolean",
        required: true,
      },
    },
    relationships: {
      requirement: {
        model: "Requirement",
        direction: "out",
        name: "RELATED_TO",
        cardinality: "one",
      },
      useCase: {
        model: "UseCase",
        direction: "out",
        name: "BELONG_TO",
        cardinality: "one",
      },
    },
  });

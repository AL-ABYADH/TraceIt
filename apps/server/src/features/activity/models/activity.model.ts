import { defineModelFactory, ModelFactoryDefinition, NeogmaModel } from "@repo/custom-neogma";
import { RequirementAttributes } from "src/features/requirement/models/requirement.model";
import { UseCaseAttributes } from "src/features/use-case/models/use-case.model";

export type ActivityAttributes = {
  id: string;
  name: string;
  useCaseId: string;
  requirementId: string;
  requirementUpdated: boolean;
  requirementDeleted: boolean;
  createdAt: string;
  updatedAt?: string;
};

export interface ActivityRelationships {
  requirement?: RequirementAttributes;
  useCase?: UseCaseAttributes;
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
      requirementId: {
        type: "string",
        required: true,
        pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$",
        message: "is not a valid UUID v4",
      },
      useCaseId: {
        type: "string",
        required: true,
        pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$",
        message: "is not a valid UUID v4",
      },
      requirementUpdated: {
        type: "boolean",
        required: true,
      },
      requirementDeleted: {
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

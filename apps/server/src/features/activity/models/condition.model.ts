import { defineModelFactory, ModelFactoryDefinition, NeogmaModel } from "@repo/custom-neogma";
import { RequirementAttributes } from "src/features/requirement/models/requirement.model";
import { UseCaseAttributes } from "src/features/use-case/models/use-case.model";

export type ConditionAttributes = {
  id: string;
  name: string;
  requirementUpdated: boolean;
  createdAt: string;
  updatedAt?: string;
};

export interface ConditionRelationships {
  requirement: RequirementAttributes;
  useCase: UseCaseAttributes;
}

export type ConditionModelType = NeogmaModel<ConditionAttributes, ConditionRelationships>;

export const ConditionModel: ModelFactoryDefinition<ConditionAttributes, ConditionRelationships> =
  defineModelFactory<ConditionAttributes, ConditionRelationships>({
    name: "Condition",
    label: ["Condition"],
    schema: {
      name: {
        type: "string",
        required: true,
        minLength: 1,
        maxLength: 100,
        allowEmpty: false,
        message: "Condition condition must be between 1 and 100 characters",
      },
      requirementUpdated: {
        type: "boolean",
        default: false,
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

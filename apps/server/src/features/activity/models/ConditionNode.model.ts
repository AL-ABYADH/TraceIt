import { defineModelFactory, ModelFactoryDefinition, NeogmaModel } from "@repo/custom-neogma";
import { RequirementAttributes } from "src/features/requirement/models/requirement.model";

export type ConditionNodeAttributes = {
  condition: string;
};

export interface ConditionNodeRelationships {
  requirement: RequirementAttributes;
}

export type ConditionNodeModelType = NeogmaModel<
  ConditionNodeAttributes,
  ConditionNodeRelationships
>;

export const ConditionNodeModel: ModelFactoryDefinition<
  ConditionNodeAttributes,
  ConditionNodeRelationships
> = defineModelFactory<ConditionNodeAttributes, ConditionNodeRelationships>({
  name: "ConditionNode",
  label: ["ConditionNode"],
  schema: {
    condition: {
      type: "string",
      required: true,
      minLength: 1,
      maxLength: 100,
      allowEmpty: false,
      message: "ConditionNode condition must be between 1 and 100 characters",
    },
  },
  relationships: {
    requirement: {
      model: "Requirement",
      direction: "out",
      name: "RELATED_TO",
      cardinality: "one",
    },
  },
});

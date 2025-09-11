import { ModelFactoryDefinition, NeogmaModel, defineModelFactory } from "@repo/custom-neogma";
import {
  SimpleRequirementAttributes,
  SimpleRequirementModel,
  SimpleRequirementRelationships,
} from "../simple-requirement.model";
import { RequirementAttributes } from "../requirement.model";

export type ConditionalRequirementAttributes = SimpleRequirementAttributes & {
  condition: string;
};

export interface ConditionalRequirementRelationships extends SimpleRequirementRelationships {
  requirement: RequirementAttributes;
}

export type ConditionalRequirementModelType = NeogmaModel<
  ConditionalRequirementAttributes,
  ConditionalRequirementRelationships
>;

export const ConditionalRequirementModel: ModelFactoryDefinition<
  ConditionalRequirementAttributes,
  ConditionalRequirementRelationships
> = defineModelFactory<ConditionalRequirementAttributes, ConditionalRequirementRelationships>({
  name: "ConditionalRequirement",
  label: [...SimpleRequirementModel.parameters.label, "ConditionalRequirement"],
  schema: {
    ...SimpleRequirementModel.parameters.schema,
    condition: {
      type: "string",
      required: true,
      maxLength: 50,
      message: "Condition must not exceed 50 characters",
    },
  },
  relationships: {
    ...SimpleRequirementModel.parameters.relationships,
    requirement: {
      model: "Requirement",
      direction: "out",
      name: "HAS_CONDITION",
      cardinality: "one",
    },
  },
});

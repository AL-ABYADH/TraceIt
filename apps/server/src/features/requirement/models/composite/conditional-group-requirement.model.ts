import { ModelFactoryDefinition, NeogmaModel, defineModelFactory } from "@repo/custom-neogma";
import {
  CompositeRequirementAttributes,
  CompositeRequirementModel,
  CompositeRequirementRelationships,
} from "../composite-requirement.model";
import { RequirementAttributes } from "../requirement.model";
import { ConditionalRequirementAttributes } from "../simple/conditional-requirement.model";

export type ConditionalGroupRequirementAttributes = CompositeRequirementAttributes & {
  conditionalValue: string;
};

export interface ConditionalGroupRequirementRelationships
  extends CompositeRequirementRelationships {
  primaryCondition: ConditionalRequirementAttributes;
  alternativeConditions: ConditionalRequirementAttributes[];
  fallbackCondition: RequirementAttributes;
}

export type ConditionalGroupRequirementModelType = NeogmaModel<
  ConditionalGroupRequirementAttributes,
  ConditionalGroupRequirementRelationships
>;

export const ConditionalGroupRequirementModel: ModelFactoryDefinition<
  ConditionalGroupRequirementAttributes,
  ConditionalGroupRequirementRelationships
> = defineModelFactory<
  ConditionalGroupRequirementAttributes,
  ConditionalGroupRequirementRelationships
>({
  name: "ConditionalGroupRequirement",
  label: [...CompositeRequirementModel.parameters.label, "ConditionalGroupRequirement"],
  schema: {
    ...CompositeRequirementModel.parameters.schema,
    conditionalValue: {
      type: "string",
      required: true,
      maxLength: 50,
      message: "Conditional value must be a noun phrase and not exceed 50 characters",
    },
  },
  relationships: {
    ...CompositeRequirementModel.parameters.relationships,
    primaryCondition: {
      model: "ConditionalRequirement",
      direction: "out",
      name: "HAS_PRIMARY_CONDITION",
      cardinality: "one",
    },
    alternativeConditions: {
      model: "ConditionalRequirement",
      direction: "out",
      name: "HAS_ALTERNATIVE_CONDITION",
      cardinality: "many",
    },
    fallbackCondition: {
      model: "Requirement",
      direction: "out",
      name: "HAS_FALLBACK",
      cardinality: "one",
    },
  },
});

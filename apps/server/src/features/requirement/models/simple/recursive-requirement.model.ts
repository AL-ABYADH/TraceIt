import { ModelFactoryDefinition, NeogmaModel, defineModelFactory } from "@repo/custom-neogma";
import {
  SimpleRequirementAttributes,
  SimpleRequirementModel,
  SimpleRequirementRelationships,
} from "../simple-requirement.model";
import { RequirementAttributes } from "../requirement.model";

export type RecursiveRequirementAttributes = SimpleRequirementAttributes & {};

export interface RecursiveRequirementRelationships extends SimpleRequirementRelationships {
  requirement: RequirementAttributes;
}

export type RecursiveRequirementModelType = NeogmaModel<
  RecursiveRequirementAttributes,
  RecursiveRequirementRelationships
>;

export const RecursiveRequirementModel: ModelFactoryDefinition<
  RecursiveRequirementAttributes,
  RecursiveRequirementRelationships
> = defineModelFactory<RecursiveRequirementAttributes, RecursiveRequirementRelationships>({
  name: "RecursiveRequirement",
  label: [...SimpleRequirementModel.parameters.label, "RecursiveRequirement"],
  schema: {
    ...SimpleRequirementModel.parameters.schema,
  },
  relationships: {
    ...SimpleRequirementModel.parameters.relationships,
    requirement: {
      model: "Requirement",
      direction: "out",
      name: "RECURSES_TO",
      cardinality: "one",
    },
  },
});

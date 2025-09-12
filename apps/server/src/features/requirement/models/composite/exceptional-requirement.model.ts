import { ModelFactoryDefinition, NeogmaModel, defineModelFactory } from "@repo/custom-neogma";
import {
  CompositeRequirementAttributes,
  CompositeRequirementModel,
  CompositeRequirementRelationships,
} from "../composite-requirement.model";
import { RequirementAttributes } from "../requirement.model";

export type ExceptionalRequirementAttributes = CompositeRequirementAttributes & {
  exception: string;
};

export interface ExceptionalRequirementRelationships extends CompositeRequirementRelationships {
  requirements: RequirementAttributes[];
}

export type ExceptionalRequirementModelType = NeogmaModel<
  ExceptionalRequirementAttributes,
  ExceptionalRequirementRelationships
>;

export const ExceptionalRequirementModel: ModelFactoryDefinition<
  ExceptionalRequirementAttributes,
  ExceptionalRequirementRelationships
> = defineModelFactory<ExceptionalRequirementAttributes, ExceptionalRequirementRelationships>({
  name: "ExceptionalRequirement",
  label: [...CompositeRequirementModel.parameters.label, "ExceptionalRequirement"],
  schema: {
    ...CompositeRequirementModel.parameters.schema,
    exception: {
      type: "string",
      required: true,
      maxLength: 100,
      message: "Exception must not exceed 100 characters",
    },
  },
  relationships: {
    ...CompositeRequirementModel.parameters.relationships,
    requirements: {
      model: "Requirement",
      direction: "out",
      name: "HANDLES_EXCEPTION_WITH",
      cardinality: "many",
    },
  },
});

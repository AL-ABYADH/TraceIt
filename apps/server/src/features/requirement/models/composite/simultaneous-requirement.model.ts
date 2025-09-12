import { ModelFactoryDefinition, NeogmaModel, defineModelFactory } from "@repo/custom-neogma";
import {
  CompositeRequirementAttributes,
  CompositeRequirementModel,
  CompositeRequirementRelationships,
} from "../composite-requirement.model";
import { SimpleRequirementAttributes } from "../simple-requirement.model";

export type SimultaneousRequirementAttributes = CompositeRequirementAttributes & {};

export interface SimultaneousRequirementRelationships extends CompositeRequirementRelationships {
  simpleRequirements: SimpleRequirementAttributes[];
}

export type SimultaneousRequirementModelType = NeogmaModel<
  SimultaneousRequirementAttributes,
  SimultaneousRequirementRelationships
>;

export const SimultaneousRequirementModel: ModelFactoryDefinition<
  SimultaneousRequirementAttributes,
  SimultaneousRequirementRelationships
> = defineModelFactory<SimultaneousRequirementAttributes, SimultaneousRequirementRelationships>({
  name: "SimultaneousRequirement",
  label: [...CompositeRequirementModel.parameters.label, "SimultaneousRequirement"],
  schema: {
    ...CompositeRequirementModel.parameters.schema,
  },
  relationships: {
    ...CompositeRequirementModel.parameters.relationships,
    simpleRequirements: {
      model: "SimpleRequirement",
      direction: "out",
      name: "EXECUTES_SIMULTANEOUSLY",
      cardinality: "many",
    },
  },
});

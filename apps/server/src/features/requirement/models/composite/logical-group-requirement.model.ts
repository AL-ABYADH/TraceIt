import { ModelFactoryDefinition, NeogmaModel, defineModelFactory } from "@repo/custom-neogma";
import {
  CompositeRequirementAttributes,
  CompositeRequirementModel,
  CompositeRequirementRelationships,
} from "../composite-requirement.model";
import { RequirementAttributes } from "../requirement.model";
import { SimpleRequirementAttributes } from "../simple-requirement.model";

export type LogicalGroupRequirementAttributes = CompositeRequirementAttributes & {};

export interface LogicalGroupRequirementRelationships extends CompositeRequirementRelationships {
  mainRequirement: SimpleRequirementAttributes;
  detailRequirements: RequirementAttributes[];
}

export type LogicalGroupRequirementModelType = NeogmaModel<
  LogicalGroupRequirementAttributes,
  LogicalGroupRequirementRelationships
>;

export const LogicalGroupRequirementModel: ModelFactoryDefinition<
  LogicalGroupRequirementAttributes,
  LogicalGroupRequirementRelationships
> = defineModelFactory<LogicalGroupRequirementAttributes, LogicalGroupRequirementRelationships>({
  name: "LogicalGroupRequirement",
  label: [...CompositeRequirementModel.parameters.label, "LogicalGroupRequirement"],
  schema: {
    ...CompositeRequirementModel.parameters.schema,
  },
  relationships: {
    ...CompositeRequirementModel.parameters.relationships,
    mainRequirement: {
      model: "SimpleRequirement",
      direction: "out",
      name: "HAS_MAIN",
      cardinality: "one",
    },
    detailRequirements: {
      model: "Requirement",
      direction: "out",
      name: "HAS_DETAILS",
      cardinality: "many",
    },
  },
});

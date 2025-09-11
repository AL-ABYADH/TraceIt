import {
  ModelFactoryDefinition,
  NeogmaModel,
  defineModelFactory,
  defineAbstractModelFactory,
  AbstractModelFactoryDefinition,
  AbstractNeogmaModel,
} from "@repo/custom-neogma";
import {
  RequirementAttributes,
  RequirementModel,
  RequirementRelationships,
} from "./requirement.model";

export type CompositeRequirementAttributes = RequirementAttributes & {};

export interface CompositeRequirementRelationships extends RequirementRelationships {
  subRequirements: RequirementAttributes[];
}

export type CompositeRequirementModelType = AbstractNeogmaModel<
  CompositeRequirementAttributes,
  CompositeRequirementRelationships
>;

export const CompositeRequirementModel: AbstractModelFactoryDefinition<
  CompositeRequirementAttributes,
  CompositeRequirementRelationships
> = defineAbstractModelFactory<CompositeRequirementAttributes, CompositeRequirementRelationships>({
  name: "CompositeRequirement",
  label: [...RequirementModel.parameters.label, "CompositeRequirement"],
  schema: {
    ...RequirementModel.parameters.schema,
  },
  relationships: {
    ...RequirementModel.parameters.relationships,
    subRequirements: {
      model: "Requirement",
      direction: "out",
      name: "CONTAINS",
      cardinality: "many",
    },
  },
});

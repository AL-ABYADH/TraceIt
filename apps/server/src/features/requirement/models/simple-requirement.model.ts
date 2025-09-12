import {
  AbstractNeogmaModel,
  AbstractModelFactoryDefinition,
  defineAbstractModelFactory,
} from "@repo/custom-neogma";
import {
  RequirementAttributes,
  RequirementModel,
  RequirementRelationships,
} from "./requirement.model";

export type SimpleRequirementAttributes = RequirementAttributes & {};

export interface SimpleRequirementRelationships extends RequirementRelationships {}

export type SimpleRequirementModelType = AbstractNeogmaModel<
  SimpleRequirementAttributes,
  SimpleRequirementRelationships
>;

export const SimpleRequirementModel: AbstractModelFactoryDefinition<
  SimpleRequirementAttributes,
  SimpleRequirementRelationships
> = defineAbstractModelFactory<SimpleRequirementAttributes, SimpleRequirementRelationships>({
  name: "SimpleRequirement",
  label: [...RequirementModel.parameters.label, "SimpleRequirement"],
  schema: {
    ...RequirementModel.parameters.schema,
  },
  relationships: { ...RequirementModel.parameters.relationships },
});

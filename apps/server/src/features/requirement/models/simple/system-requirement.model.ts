import { ModelFactoryDefinition, NeogmaModel, defineModelFactory } from "@repo/custom-neogma";
import {
  SimpleRequirementAttributes,
  SimpleRequirementModel,
  SimpleRequirementRelationships,
} from "../simple-requirement.model";

export type SystemRequirementAttributes = SimpleRequirementAttributes & {
  operation: string;
};

export interface SystemRequirementRelationships extends SimpleRequirementRelationships {}

export type SystemRequirementModelType = NeogmaModel<
  SystemRequirementAttributes,
  SystemRequirementRelationships
>;

export const SystemRequirementModel: ModelFactoryDefinition<
  SystemRequirementAttributes,
  SystemRequirementRelationships
> = defineModelFactory<SystemRequirementAttributes, SystemRequirementRelationships>({
  name: "SystemRequirement",
  label: [...SimpleRequirementModel.parameters.label, "SystemRequirement"],
  schema: {
    ...SimpleRequirementModel.parameters.schema,
    operation: {
      type: "string",
      required: true,
      maxLength: 100,
      // Checking for verb phrase - this is a basic check that can be enhanced
      pattern: "^[A-Za-z].+",
      message: "Operation must be a verb phrase and not exceed 100 characters",
    },
  },
  relationships: {
    ...SimpleRequirementModel.parameters.relationships,
  },
});

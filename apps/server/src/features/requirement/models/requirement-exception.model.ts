import { defineModelFactory, ModelFactoryDefinition, NeogmaModel } from "@repo/custom-neogma";
import { RequirementAttributes } from "./requirement.model";

export type RequirementExceptionAttributes = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
};

export interface RequirementExceptionRelationships {
  requirements: RequirementAttributes[];
  requirement: RequirementAttributes;
}

export type RequirementExceptionModelType = NeogmaModel<
  RequirementExceptionAttributes,
  RequirementExceptionRelationships
>;

export const RequirementExceptionModel: ModelFactoryDefinition<
  RequirementExceptionAttributes,
  RequirementExceptionRelationships
> = defineModelFactory<RequirementExceptionAttributes, RequirementExceptionRelationships>({
  name: "RequirementException",
  label: ["RequirementException"],
  schema: {
    name: {
      type: "string",
      required: true,
      allowEmpty: false,
    },
  },
  relationships: {
    requirements: {
      model: "Requirement",
      name: "BELONGS_TO",
      direction: "in",
      cardinality: "many",
    },
    requirement: {
      model: "Requirement",
      name: "EXCEPTION_AT",
      direction: "out",
      cardinality: "one",
    },
  },
});

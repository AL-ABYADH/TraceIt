import { defineModelFactory, ModelFactoryDefinition, NeogmaModel } from "@repo/custom-neogma";
import { UseCaseAttributes } from "../../use-case/models/use-case.model";
import { ActorAttributes } from "../../actor/models/actor.model";
import { RequirementExceptionAttributes } from "./requirement-exception.model";

export type RequirementAttributes = {
  id: string;
  operation: string;
  condition?: string;
  createdAt: string;
  updatedAt?: string;
};

export interface RequirementRelationships {
  useCase: UseCaseAttributes;
  actors?: ActorAttributes[];
  nestedRequirements?: RequirementAttributes[];
  exceptions?: RequirementExceptionAttributes[];
  exceptionRequirement?: RequirementExceptionAttributes[];
}

export type RequirementModelType = NeogmaModel<RequirementAttributes, RequirementRelationships>;

export const RequirementModel: ModelFactoryDefinition<
  RequirementAttributes,
  RequirementRelationships
> = defineModelFactory<RequirementAttributes, RequirementRelationships>({
  name: "Requirement",
  label: ["Requirement"],
  schema: {
    operation: {
      type: "string",
      required: true,
      allowEmpty: false,
    },
    condition: {
      type: "string",
      required: false,
      allowEmpty: false,
    },
  },
  relationships: {
    useCase: {
      model: "UseCase",
      name: "BELONGS_TO",
      direction: "out",
      cardinality: "one",
    },
    actors: {
      model: "Actor",
      name: "BELONGS_TO",
      direction: "out",
      cardinality: "many",
    },
    nestedRequirements: {
      model: "self",
      name: "BELONGS_TO",
      direction: "out",
      cardinality: "many",
    },
    exceptions: {
      model: "RequirementException",
      name: "EXCEPTION_AT",
      direction: "in",
      cardinality: "many",
    },
    exceptionRequirement: {
      model: "RequirementException",
      name: "BELONGS_TO",
      direction: "in",
      cardinality: "many",
    },
  },
});

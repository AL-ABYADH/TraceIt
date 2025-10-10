import { defineModelFactory, ModelFactoryDefinition, NeogmaModel } from "@repo/custom-neogma";
import { SecondaryUseCaseAttributes } from "src/features/use-case/models/secondary-use-case.model";
import { ActorAttributes } from "../../actor/models/actor.model";
import { UseCaseAttributes } from "../../use-case/models/use-case.model";
import { RequirementExceptionAttributes } from "./requirement-exception.model";
import { NodeAttributes } from "src/features/diagram/models/node.model";

export type RequirementAttributes = {
  id: string;
  operation: string;
  condition?: string;
  activityLabel?: string;
  conditionLabel?: string;
  isActivityStale: boolean;
  isConditionStale: boolean;
  createdAt: string;
  updatedAt?: string;
};

export interface RequirementRelationships {
  useCase?: UseCaseAttributes;
  secondaryUseCase?: SecondaryUseCaseAttributes;
  actors?: ActorAttributes[];
  nestedRequirements?: RequirementAttributes[];
  exceptions?: RequirementExceptionAttributes[];
  requirementException?: RequirementExceptionAttributes;
  nodes?: NodeAttributes[];
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
    activityLabel: {
      type: "string",
      required: false,
      allowEmpty: false,
    },
    conditionLabel: {
      type: "string",
      required: false,
      allowEmpty: false,
    },
    isActivityStale: {
      type: "boolean",
      required: true,
    },
    isConditionStale: {
      type: "boolean",
      required: true,
    },
  },
  relationships: {
    useCase: {
      model: "UseCase",
      name: "BELONGS_TO",
      direction: "out",
      cardinality: "one",
    },
    secondaryUseCase: {
      model: "SecondaryUseCase",
      name: "SUB_FLOW_FOR",
      direction: "in",
      cardinality: "one",
    },
    actors: {
      model: "Actor",
      name: "HAS_ACTOR",
      direction: "out",
      cardinality: "many",
    },
    nestedRequirements: {
      model: "self",
      name: "DETAILS",
      direction: "in",
      cardinality: "many",
    },
    exceptions: {
      model: "RequirementException",
      name: "EXCEPTION_AT",
      direction: "in",
      cardinality: "many",
    },
    requirementException: {
      model: "RequirementException",
      name: "BELONGS_TO",
      direction: "out",
      cardinality: "one",
    },
    nodes: {
      model: "Node",
      name: "HAS_DATA",
      direction: "in",
      cardinality: "many",
    },
  },
});

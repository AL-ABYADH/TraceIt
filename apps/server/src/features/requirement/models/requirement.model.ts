import { defineModelFactory, ModelFactoryDefinition, NeogmaModel } from "@repo/custom-neogma";
import { SecondaryUseCaseAttributes } from "src/features/use-case/models/secondary-use-case.model";
import { ActorAttributes } from "../../actor/models/actor.model";
import { UseCaseAttributes } from "../../use-case/models/use-case.model";
import { RequirementExceptionAttributes } from "./requirement-exception.model";
import { ConditionAttributes } from "src/features/activity/models/condition.model";
import { ActivityAttributes } from "src/features/activity/models/activity.model";

export type RequirementAttributes = {
  id: string;
  operation: string;
  condition?: string;
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
  relatedCondition: ConditionAttributes;
  relatedActivity: ActivityAttributes;
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
    relatedCondition: {
      model: "Condition",
      name: "RELATED_TO",
      direction: "in",
      cardinality: "one",
    },
    relatedActivity: {
      model: "Activity",
      name: "RELATED_TO",
      direction: "in",
      cardinality: "one",
    },
  },
});

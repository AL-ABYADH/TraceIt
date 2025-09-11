import { ModelFactoryDefinition, NeogmaModel, defineModelFactory } from "@repo/custom-neogma";
import {
  SimpleRequirementAttributes,
  SimpleRequirementModel,
  SimpleRequirementRelationships,
} from "../simple-requirement.model";
import { ActorAttributes } from "../../../actor/models/actor.model";

export type ActorRequirementAttributes = SimpleRequirementAttributes & {
  operation: string;
};

export interface ActorRequirementRelationships extends SimpleRequirementRelationships {
  actors: ActorAttributes[]; // Will contain only non-event actors
}

export type ActorRequirementModelType = NeogmaModel<
  ActorRequirementAttributes,
  ActorRequirementRelationships
>;

export const ActorRequirementModel: ModelFactoryDefinition<
  ActorRequirementAttributes,
  ActorRequirementRelationships
> = defineModelFactory<ActorRequirementAttributes, ActorRequirementRelationships>({
  name: "ActorRequirement",
  label: [...SimpleRequirementModel.parameters.label, "ActorRequirement"],
  schema: {
    ...SimpleRequirementModel.parameters.schema,
    operation: {
      type: "string",
      required: true,
      maxLength: 100,
      pattern: "^[A-Za-z].+",
      message: "Operation must be a verb phrase and not exceed 100 characters",
    },
  },
  relationships: {
    ...SimpleRequirementModel.parameters.relationships,
    actors: {
      model: "Actor", // In the service layer, we'll validate that these are not EventActors
      direction: "out",
      name: "INVOLVES",
      cardinality: "many",
    },
  },
});

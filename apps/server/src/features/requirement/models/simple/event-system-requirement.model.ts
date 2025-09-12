import { ModelFactoryDefinition, NeogmaModel, defineModelFactory } from "@repo/custom-neogma";
import { ActorAttributes } from "../../../actor/models/actor.model";
import {
  SimpleRequirementAttributes,
  SimpleRequirementModel,
  SimpleRequirementRelationships,
} from "../simple-requirement.model";

export type EventSystemRequirementAttributes = SimpleRequirementAttributes & {
  operation: string;
};

export interface EventSystemRequirementRelationships extends SimpleRequirementRelationships {
  event: ActorAttributes;
}

export type EventSystemRequirementModelType = NeogmaModel<
  EventSystemRequirementAttributes,
  EventSystemRequirementRelationships
>;

export const EventSystemRequirementModel: ModelFactoryDefinition<
  EventSystemRequirementAttributes,
  EventSystemRequirementRelationships
> = defineModelFactory<EventSystemRequirementAttributes, EventSystemRequirementRelationships>({
  name: "EventSystemRequirement",
  label: [...SimpleRequirementModel.parameters.label, "EventSystemRequirement"],
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
    event: {
      model: "EventActor", // This ensures only event actors can be used here
      direction: "out",
      name: "TRIGGERED_BY",
      cardinality: "one",
    },
  },
});

import { NeogmaModel, ModelFactoryDefinition, defineModelFactory } from "@repo/custom-neogma";
import { ActorAttributes, ActorModel, ActorRelationships } from "./actor.model";

export interface EventActorAttributes extends ActorAttributes {}

interface EventActorRelationships extends ActorRelationships {}

export type EventActorModelType = NeogmaModel<EventActorAttributes, EventActorRelationships>;

export const EventActorModel: ModelFactoryDefinition<
  EventActorAttributes,
  EventActorRelationships
> = defineModelFactory<EventActorAttributes, EventActorRelationships>({
  name: "EventActor",
  label: [...ActorModel.parameters.label, "EventActor"],
  schema: {
    ...ActorModel.parameters.schema,
  },
  relationships: { ...ActorModel.parameters.relationships },
});

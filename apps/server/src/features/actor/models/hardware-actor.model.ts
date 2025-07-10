import { NeogmaModel, ModelFactoryDefinition, defineModelFactory } from "@repo/custom-neogma";
import { ActorAttributes, ActorModel, ActorRelationships } from "./actor.model";

export interface HardwareActorAttributes extends ActorAttributes {}

interface HardwareActorRelationships extends ActorRelationships {}

export type HardwareActorModelType = NeogmaModel<
  HardwareActorAttributes,
  HardwareActorRelationships
>;

export const HardwareActorModel: ModelFactoryDefinition<
  HardwareActorAttributes,
  HardwareActorRelationships
> = defineModelFactory<HardwareActorAttributes, HardwareActorRelationships>({
  name: "HardwareActor",
  label: [...ActorModel.parameters.label, "HardwareActor"],
  schema: {
    ...ActorModel.parameters.schema,
  },
  primaryKeyField: ActorModel.parameters.primaryKeyField,
  relationships: { ...ActorModel.parameters.relationships },
});

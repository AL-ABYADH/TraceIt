import { NeogmaModel, ModelFactoryDefinition, defineModelFactory } from "@repo/custom-neogma";
import { ActorAttributes, ActorModel, ActorRelationships } from "./actor.model";

export interface HumanActorAttributes extends ActorAttributes {}

interface HumanActorRelationships extends ActorRelationships {}

export type HumanActorModelType = NeogmaModel<HumanActorAttributes, HumanActorRelationships>;

export const HumanActorModel: ModelFactoryDefinition<
  HumanActorAttributes,
  HumanActorRelationships
> = defineModelFactory<HumanActorAttributes, HumanActorRelationships>({
  name: "HumanActor",
  label: [...ActorModel.parameters.label, "HumanActor"],
  schema: {
    ...ActorModel.parameters.schema,
  },
  relationships: { ...ActorModel.parameters.relationships },
});

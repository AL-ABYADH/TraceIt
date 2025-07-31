import { NeogmaModel, ModelFactoryDefinition, defineModelFactory } from "@repo/custom-neogma";
import { ActorAttributes, ActorModel, ActorRelationships } from "./actor.model";

export interface SoftwareActorAttributes extends ActorAttributes {}

interface SoftwareActorRelationships extends ActorRelationships {}

export type SoftwareActorModelType = NeogmaModel<
  SoftwareActorAttributes,
  SoftwareActorRelationships
>;

export const SoftwareActorModel: ModelFactoryDefinition<
  SoftwareActorAttributes,
  SoftwareActorRelationships
> = defineModelFactory<SoftwareActorAttributes, SoftwareActorRelationships>({
  name: "SoftwareActor",
  label: [...ActorModel.parameters.label, "SoftwareActor"],
  schema: {
    ...ActorModel.parameters.schema,
  },
  relationships: { ...ActorModel.parameters.relationships },
});

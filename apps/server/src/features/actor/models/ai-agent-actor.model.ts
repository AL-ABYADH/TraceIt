import { NeogmaModel, ModelFactoryDefinition, defineModelFactory } from "@repo/custom-neogma";
import { ActorAttributes, ActorModel, ActorRelationships } from "./actor.model";

export interface AiAgentActorAttributes extends ActorAttributes {}

interface AiAgentActorRelationships extends ActorRelationships {}

export type AiAgentActorModelType = NeogmaModel<AiAgentActorAttributes, AiAgentActorRelationships>;

export const AiAgentActorModel: ModelFactoryDefinition<
  AiAgentActorAttributes,
  AiAgentActorRelationships
> = defineModelFactory<AiAgentActorAttributes, AiAgentActorRelationships>({
  name: "AiAgentActor",
  label: [...ActorModel.parameters.label, "AiAgentActor"],
  schema: {
    ...ActorModel.parameters.schema,
  },
  relationships: { ...ActorModel.parameters.relationships },
});

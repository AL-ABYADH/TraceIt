import { ModelFactoryDefinition, NeogmaModel, defineModelFactory } from "@repo/custom-neogma";
import {
  SimpleRequirementAttributes,
  SimpleRequirementModel,
  SimpleRequirementRelationships,
} from "../simple-requirement.model";
import { ActorAttributes } from "../../../actor/models/actor.model";

export type SystemActorCommunicationRequirementAttributes = SimpleRequirementAttributes & {
  communicationInfo: string;
  communicationFacility: string;
};

export interface SystemActorCommunicationRequirementRelationships
  extends SimpleRequirementRelationships {
  actors: ActorAttributes[];
}

export type SystemActorCommunicationRequirementModelType = NeogmaModel<
  SystemActorCommunicationRequirementAttributes,
  SystemActorCommunicationRequirementRelationships
>;

export const SystemActorCommunicationRequirementModel: ModelFactoryDefinition<
  SystemActorCommunicationRequirementAttributes,
  SystemActorCommunicationRequirementRelationships
> = defineModelFactory<
  SystemActorCommunicationRequirementAttributes,
  SystemActorCommunicationRequirementRelationships
>({
  name: "SystemActorCommunicationRequirement",
  label: [...SimpleRequirementModel.parameters.label, "SystemActorCommunicationRequirement"],
  schema: {
    ...SimpleRequirementModel.parameters.schema,
    communicationInfo: {
      type: "string",
      required: true,
      maxLength: 200,
      message: "Communication info must not exceed 200 characters",
    },
    communicationFacility: {
      type: "string",
      required: true,
      maxLength: 30,
      message: "Communication facility must not exceed 30 characters",
    },
  },
  relationships: {
    ...SimpleRequirementModel.parameters.relationships,
    actors: {
      model: "HumanActor", // Ensures only human actors are used for communication
      direction: "out",
      name: "COMMUNICATES_WITH",
      cardinality: "many",
    },
  },
});

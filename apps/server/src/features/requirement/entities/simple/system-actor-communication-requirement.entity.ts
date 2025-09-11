import {
  SystemActorCommunicationRequirementAttributes,
  SystemActorCommunicationRequirementRelationships,
} from "../../models/simple/system-actor-communication-requirement.model";

export type SystemActorCommunicationRequirement = SystemActorCommunicationRequirementAttributes &
  Partial<SystemActorCommunicationRequirementRelationships>;

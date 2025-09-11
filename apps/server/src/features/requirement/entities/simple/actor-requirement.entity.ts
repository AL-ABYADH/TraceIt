import {
  ActorRequirementAttributes,
  ActorRequirementRelationships,
} from "../../models/simple/actor-requirement.model";

export type ActorRequirement = ActorRequirementAttributes & Partial<ActorRequirementRelationships>;

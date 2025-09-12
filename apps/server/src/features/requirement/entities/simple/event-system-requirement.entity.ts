import {
  EventSystemRequirementAttributes,
  EventSystemRequirementRelationships,
} from "../../models/simple/event-system-requirement.model";

export type EventSystemRequirement = EventSystemRequirementAttributes &
  Partial<EventSystemRequirementRelationships>;

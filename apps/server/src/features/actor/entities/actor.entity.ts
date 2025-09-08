import { ActorAttributes, ActorRelationships } from "../models/actor.model";

export type Actor = ActorAttributes & Partial<ActorRelationships>;

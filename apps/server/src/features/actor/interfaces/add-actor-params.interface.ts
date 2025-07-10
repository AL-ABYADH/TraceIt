import { ActorSubtype } from "../enums/actor-subtype.enum";

export interface AddActorParamsInterface {
  name: string;
  projectId: string;
  subType: ActorSubtype;
}

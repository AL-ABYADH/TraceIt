import { ActorSubtype } from "../enums/actor-subtype.enum";
import { AddActorParamsInterface } from "../interfaces/add-actor-params.interface";

export class AddActorParamsDto implements AddActorParamsInterface {
  name: string;
  projectId: string;
  subType: ActorSubtype;
}

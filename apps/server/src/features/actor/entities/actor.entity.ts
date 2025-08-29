import { Project } from "src/features/project/entities/project.entity";
import { ActorType } from "../enums/actor-type.enum";
import { ActorSubtype } from "../enums/actor-subtype.enum";

export abstract class Actor {
  id: string;
  name: string;
  project: Project;
  type: ActorType;
  subtype: ActorSubtype;
  createdAt: Date;
  updatedAt?: Date;
}

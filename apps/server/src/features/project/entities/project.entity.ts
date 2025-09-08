import { ProjectStatus } from "../enums/project-status.enum";
import { Actor } from "src/features/actor/entities/actor.entity";
import { Class } from "src/features/class/entities/class.entity";
import { ProjectCollaboration } from "./project-collaboration.entity";
import { UseCase } from "../../use-case/entities/use-case.entity";
import { UserAttributes } from "../../user/models/user.model";

export class Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt?: Date;
  owner: UserAttributes;
  collaborations?: ProjectCollaboration[];
  actors?: Actor[];
  useCases?: UseCase[];
  classes?: Class[];
}

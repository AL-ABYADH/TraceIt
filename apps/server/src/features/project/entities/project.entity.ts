import { ProjectStatus } from "../enums/project-status.enum";
import { Actor } from "src/features/actor/entities/actor.entity";
import { Class } from "src/features/class/entities/class.entity";
import { ProjectCollaboration } from "./project-collaboration.entity";
import { User } from "../../user/models/user.model";
import { UseCase } from "../../use-case/entities/use-case.entity";

export class Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt?: Date;
  owner: User;
  collaborations?: ProjectCollaboration[];
  actors?: Actor[];
  useCases?: UseCase[];
  classes?: Class[];
}

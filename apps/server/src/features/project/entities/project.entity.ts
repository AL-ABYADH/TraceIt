import { User } from "src/features/user/entities/user.entity";
import { ProjectStatus } from "../enums/project-status.enum";
import { Actor } from "src/features/actor/entities/actor.entity";
import { UseCase } from "src/features/use-case/entities/use-case.entity";
import { Class } from "src/features/class/entities/class.entity";
import { ProjectCollaboration } from "./project-collaboration.entity";

export class Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  createdAt: Date;
  owner: User;
  collaborations: ProjectCollaboration[] | null;
  actors: Actor[] | null;
  useCases: UseCase[] | null;
  classes: Class[] | null;
}

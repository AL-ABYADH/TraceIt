import { UseCase } from "./use-case.entity";
import { Project } from "../../project/entities/project.entity";
import { UseCaseDescription } from "./use-case-description.entity";
import { SecondaryUseCase } from "./secondary-use-case.entity";
import { Actor } from "../../actor/entities/actor.entity";

export class PrimaryUseCase extends UseCase {
  actors: Actor[];
  briefDescription?: string;
  useCaseDescription: UseCaseDescription;
  number: number;
  project: Project;
  associatedClasses: any[];
  secondaryUseCases: SecondaryUseCase[];
  sequenceDiagrams: any[];
  activityDiagram: any;
}

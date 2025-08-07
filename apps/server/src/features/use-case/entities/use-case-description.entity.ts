import { PrimaryUseCase } from "./primary-use-case.entity";
import { UseCaseImportanceLevel } from "../enums/use-case-importance-level.enum";
import { Actor } from "../../actor/entities/actor.entity";

/**
 * Represents a detailed description of a primary use case.
 * This class is not derived from UseCase, but is composed with PrimaryUseCase.
 */
export class UseCaseDescription {
  useCase: PrimaryUseCase; // The associated primary use case
  useCaseId: string; // ID of the use case (mirrors the use case model's identifier)
  importanceLevel: UseCaseImportanceLevel; // Indicates the importance level of the use case
  briefDescription: string; // A short summary of the use case
  primaryActors: Actor[]; // List of primary actors involved
  secondaryActors: Actor[]; // List of secondary actors involved
  normalFlow: any[]; // Main flow of events (List<Requirement>)
  subFlows: any[]; // Alternative or branching flows (List<LogicalGroupRequirement>)
  exceptionalFlows: any[]; // Exceptional or error flows (List<ExceptionalRequirement>)
}

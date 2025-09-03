import { UseCaseSubtype } from "../enums/use-case-subtype.enum";

/**
 * Interface representing the data required to create a use case
 * within the repository layer.
 * Includes the `subType` field for use by the factory.
 */
export interface CreateUseCaseInterface {
  name: string; // Name of the use case
  projectId: string; // ID of the project the use case belongs to
  subType: UseCaseSubtype; // Use case subtype, utilized by the factory to determine instantiation logic
}

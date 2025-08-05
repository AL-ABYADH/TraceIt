import { UseCaseSubtype } from "../enums/use-case-subtype.enum";

/**
 * Interface defining the required parameters for creating a new use case.
 */
export interface AddUseCaseParamsInterface {
  name: string; // Name of the use case
  projectId: string; // ID of the project the use case belongs to
  subType: UseCaseSubtype; // Specifies the subtype to be passed to the factory
}

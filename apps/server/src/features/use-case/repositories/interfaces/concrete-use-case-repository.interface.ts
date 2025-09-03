import { UseCase } from "../../entities/use-case.entity";
import { CreateUseCaseInterface } from "../../interfaces/create-use-case.interface";
import { UpdateUseCaseInterface } from "../../interfaces/update-use-case.interface";

/**
 * Repository interface for concrete use case implementations.
 * Generic over the returned entity type T, without constraining T to extend a base UseCase.
 */
export interface ConcreteUseCaseRepositoryInterface<T extends UseCase> {
  /**
   * Persists a new use case based on the provided DTO.
   * @param createDto - Data required to create the use case
   * @returns A promise resolving to the created entity of type T
   */
  create(createDto: CreateUseCaseInterface): Promise<T>;

  /**
   * Updates an existing use case using the provided DTO.
   * @param updateDto - Data required to update the use case
   * @returns A promise resolving to the updated entity of type T
   */
  update(updateDto: UpdateUseCaseInterface): Promise<T>;

  /**
   * Deletes a use case by its identifier.
   * @param id - Unique identifier of the use case
   * @returns A promise resolving to a boolean indicating deletion success
   */
  delete(id: string): Promise<boolean>;

  /**
   * Retrieves a use case by its identifier.
   * @param id - Unique identifier of the use case
   * @returns A promise resolving to the entity of type T, or null if not found
   */
  getById(id: string): Promise<T | null>;

  /**
   * Retrieves all use cases of this type.
   * @returns A promise resolving to an array of entities of type T
   */
  getAll(): Promise<T[]>;
}

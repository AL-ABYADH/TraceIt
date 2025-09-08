import { Injectable, NotFoundException } from "@nestjs/common";
import { UseCaseRepository } from "../../repositories/use-case/use-case.repository";
import { UseCase } from "../../entities/use-case.entity";

@Injectable()
export class UseCaseService {
  constructor(private readonly useCaseRepository: UseCaseRepository) {}

  /**
   * Retrieves all use cases for a specific project
   * @param projectId - ID of the project
   * @returns Promise resolving to an array of use cases
   */
  async listByProject(projectId: string): Promise<UseCase[]> {
    return await this.useCaseRepository.getByProject(projectId);
  }

  /**
   * Finds a use case by its ID, throwing an exception if not found
   * @param id - ID of the use case to find
   * @returns Promise resolving to the use case
   * @throws NotFoundException if the use case doesn't exist
   */
  async findById(id: string): Promise<UseCase> {
    const useCase = await this.useCaseRepository.getById(id);
    if (!useCase) {
      throw new NotFoundException(`Use case with ID ${id} not found`);
    }
    return useCase;
  }
}

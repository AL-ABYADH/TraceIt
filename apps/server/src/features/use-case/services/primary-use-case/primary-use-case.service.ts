import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrimaryUseCaseRepository } from "../../repositories/primary-use-case/primary-use-case.repository";
import { UpdatePrimaryUseCaseInterface } from "../../interfaces/update-use-case.interface";
import { CreatePrimaryUseCaseInterface } from "../../interfaces/create-use-case.interface";
import { PrimaryUseCase } from "../../entities/primary-use-case.entity";
import { ProjectService } from "../../../project/services/project/project.service";
import { ActorService } from "../../../actor/services/actor/actor.service";

@Injectable()
export class PrimaryUseCaseService {
  constructor(
    private readonly primaryUseCaseRepository: PrimaryUseCaseRepository,
    private readonly projectService: ProjectService,
    private readonly actorService: ActorService,
  ) {}

  /**
   * Creates a new primary use case in the specified project
   * @param createDto - Data transfer object containing primary use case details
   * @returns Promise resolving to the created primary use case
   * @throws BadRequestException if the project doesn't exist
   */
  async create(createDto: CreatePrimaryUseCaseInterface): Promise<PrimaryUseCase> {
    try {
      await this.projectService.findById(createDto.projectId);
      for (const actorId of [
        ...(createDto.primaryActorIds || []),
        ...(createDto.secondaryActorIds || []),
      ]) {
        await this.actorService.findById(actorId);
      }
      const useCase = await this.primaryUseCaseRepository.create(createDto);
      return useCase;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`Project with ID ${createDto.projectId} not found`);
      }
      throw error;
    }
  }

  /**
   * Updates an existing primary use case
   * @param id - ID of the primary use case to update
   * @param updateDto - Data to update in the primary use case
   * @returns Promise resolving to the updated primary use case
   * @throws NotFoundException if the primary use case doesn't exist
   */
  async update(id: string, updateDto: UpdatePrimaryUseCaseInterface): Promise<PrimaryUseCase> {
    return this.primaryUseCaseRepository.update(id, updateDto);
  }

  /**
   * Retrieves a primary use case by its ID, throwing an exception if not found
   * @param id - ID of the primary use case to find
   * @returns Promise resolving to the primary use case
   * @throws NotFoundException if the primary use case doesn't exist
   */
  async findById(id: string): Promise<PrimaryUseCase> {
    const useCase = await this.primaryUseCaseRepository.getById(id);
    if (!useCase) {
      throw new NotFoundException(`Primary use case with ID ${id} not found`);
    }
    return useCase;
  }

  /**
   * Retrieves all primary use cases for a specific project
   * @param projectId - ID of the project
   * @returns Promise resolving to an array of primary use cases
   * @throws BadRequestException if the project doesn't exist
   */
  async listByProject(projectId: string): Promise<PrimaryUseCase[]> {
    try {
      return this.primaryUseCaseRepository.getByProject(projectId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`Project with ID ${projectId} not found`);
      }
      throw error;
    }
  }

  /**
   * Removes a primary use case
   * @param id - ID of the primary use case to remove
   * @returns Promise resolving to a boolean indicating success
   * @throws NotFoundException if the primary use case doesn't exist
   */
  async remove(id: string): Promise<boolean> {
    const useCase = await this.findById(id);
    if (!useCase) {
      throw new NotFoundException(`Primary use case with ID ${id} not found`);
    }

    return this.primaryUseCaseRepository.delete(id);
  }

  /**
   * Adds primary actors to a use case
   * @param useCaseId - ID of the use case
   * @param actorIds - IDs of actors to add as primary
   * @returns Promise resolving to the updated use case
   */
  async addPrimaryActors(useCaseId: string, actorIds: string[]): Promise<PrimaryUseCase> {
    const useCase = await this.findById(useCaseId);

    for (const actorId of actorIds) {
      await this.actorService.findById(actorId);
    }

    // Get current primary actor IDs
    const currentActorIds = useCase.primaryActors?.map((actor) => actor.id) || [];

    // Combine existing and new actor IDs, removing duplicates
    const updatedActorIds = [...new Set([...currentActorIds, ...actorIds])];

    return this.primaryUseCaseRepository.update(useCaseId, {
      primaryActorIds: updatedActorIds,
    });
  }

  /**
   * Adds secondary actors to a use case
   * @param useCaseId - ID of the use case
   * @param actorIds - IDs of actors to add as secondary
   * @returns Promise resolving to the updated use case
   */
  async addSecondaryActors(useCaseId: string, actorIds: string[]): Promise<PrimaryUseCase> {
    const useCase = await this.findById(useCaseId);

    for (const actorId of actorIds) {
      await this.actorService.findById(actorId);
    }

    // Get current secondary actor IDs
    const currentActorIds = useCase.secondaryActors?.map((actor) => actor.id) || [];

    // Combine existing and new actor IDs, removing duplicates
    const updatedActorIds = [...new Set([...currentActorIds, ...actorIds])];

    return this.primaryUseCaseRepository.update(useCaseId, {
      secondaryActorIds: updatedActorIds,
    });
  }

  /**
   * Removes primary actors from a use case
   * @param useCaseId - ID of the use case
   * @param actorIds - IDs of actors to remove from primary actors
   * @returns Promise resolving to the updated use case
   */
  async removePrimaryActors(useCaseId: string, actorIds: string[]): Promise<PrimaryUseCase> {
    const useCase = await this.findById(useCaseId);

    for (const actorId of actorIds) {
      await this.actorService.findById(actorId);
    }

    // Get current primary actor IDs
    const currentActorIds = useCase.primaryActors?.map((actor) => actor.id) || [];

    // Filter out the actors to remove
    const updatedActorIds = currentActorIds.filter((id) => !actorIds.includes(id));

    return this.primaryUseCaseRepository.update(useCaseId, {
      primaryActorIds: updatedActorIds,
    });
  }

  /**
   * Removes secondary actors from a use case
   * @param useCaseId - ID of the use case
   * @param actorIds - IDs of actors to remove from secondary actors
   * @returns Promise resolving to the updated use case
   */
  async removeSecondaryActors(useCaseId: string, actorIds: string[]): Promise<PrimaryUseCase> {
    const useCase = await this.findById(useCaseId);

    // Get current secondary actor IDs
    const currentActorIds = useCase.secondaryActors?.map((actor) => actor.id) || [];

    // Filter out the actors to remove
    const updatedActorIds = currentActorIds.filter((id) => !actorIds.includes(id));

    return this.primaryUseCaseRepository.update(useCaseId, {
      secondaryActorIds: updatedActorIds,
    });
  }
}

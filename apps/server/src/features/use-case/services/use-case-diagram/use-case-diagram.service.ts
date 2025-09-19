import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { UseCaseDiagramRepository } from "../../repositories/use-case-diagram/use-case-diagram.repository";
import { UseCaseDiagram } from "../../entities/use-case-diagram.entity";
import { CreateDiagramUseCaseInterface } from "../../interfaces/create-use-case.interface";
import { UpdateUseCaseDiagramInterface } from "../../interfaces/update-use-case.interface";

@Injectable()
export class UseCaseDiagramService {
  constructor(private readonly useCaseDiagramRepository: UseCaseDiagramRepository) {}

  /**
   * Creates a new use case diagram
   * @param createDto - Data transfer object containing diagram details
   * @returns Promise resolving to the created use case diagram
   */
  async create(createDto: CreateDiagramUseCaseInterface): Promise<UseCaseDiagram> {
    try {
      return await this.useCaseDiagramRepository.create(createDto);
    } catch (error) {
      throw new BadRequestException(`Failed to create use case diagram: ${error.message}`);
    }
  }

  /**
   * Updates an existing use case diagram
   * @param id - ID of the use case diagram to update
   * @param updateDto - Data to update in the use case diagram
   * @returns Promise resolving to the updated use case diagram
   */
  async update(id: string, updateDto: UpdateUseCaseDiagramInterface): Promise<UseCaseDiagram> {
    try {
      return await this.useCaseDiagramRepository.update(id, updateDto);
    } catch (error) {
      throw new BadRequestException(`Failed to update use case diagram: ${error.message}`);
    }
  }

  /**
   * Deletes a use case diagram
   * @param id - ID of the use case diagram to delete
   * @returns Promise resolving to a boolean indicating success
   */
  async delete(id: string): Promise<boolean> {
    try {
      return await this.useCaseDiagramRepository.delete(id);
    } catch (error) {
      throw new BadRequestException(`Failed to delete use case diagram: ${error.message}`);
    }
  }

  /**
   * Retrieves a use case diagram by its ID
   * @param id - ID of the use case diagram to find
   * @returns Promise resolving to the use case diagram
   * @throws NotFoundException if the use case diagram doesn't exist
   */
  async findById(id: string): Promise<UseCaseDiagram> {
    const diagram = await this.useCaseDiagramRepository.getById(id);
    if (!diagram) {
      throw new NotFoundException(`Use case diagram with ID ${id} not found`);
    }
    return diagram;
  }

  /**
   * Retrieves all use case diagrams for a specific project
   * @param projectId - ID of the project
   * @returns Promise resolving to an array of use case diagrams
   */
  async listByProject(projectId: string): Promise<UseCaseDiagram[]> {
    try {
      return await this.useCaseDiagramRepository.getByProject(projectId);
    } catch (error) {
      throw new BadRequestException(`Failed to retrieve diagrams for project: ${error.message}`);
    }
  }

  /**
   * Adds a use case to a diagram
   * @param diagramId - ID of the diagram
   * @param useCaseId - ID of the use case to add
   * @returns Promise resolving to a boolean indicating success
   */
  async addUseCase(diagramId: string, useCaseId: string): Promise<boolean> {
    try {
      return await this.useCaseDiagramRepository.addUseCase(diagramId, useCaseId);
    } catch (error) {
      throw new BadRequestException(`Failed to add use case to diagram: ${error.message}`);
    }
  }

  /**
   * Removes a use case from a diagram
   * @param diagramId - ID of the diagram
   * @param useCaseId - ID of the use case to remove
   * @returns Promise resolving to a boolean indicating success
   */
  async removeUseCase(diagramId: string, useCaseId: string): Promise<boolean> {
    try {
      return await this.useCaseDiagramRepository.removeUseCase(diagramId, useCaseId);
    } catch (error) {
      throw new BadRequestException(`Failed to remove use case from diagram: ${error.message}`);
    }
  }
}

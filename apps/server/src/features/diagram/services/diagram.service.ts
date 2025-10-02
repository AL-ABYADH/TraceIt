import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { DiagramRepository } from "../repositories/diagram.repository";
import { Diagram } from "../entities/diagram.entity";
import { ProjectService } from "../../project/services/project/project.service";
import { DiagramInterface, UpdateDiagramInterface } from "../interfaces/diagram.interface";
import { DiagramType } from "@repo/shared-schemas";

@Injectable()
export class DiagramService {
  private readonly logger = new Logger(DiagramService.name);

  constructor(
    private readonly diagramRepository: DiagramRepository,
    private readonly projectService: ProjectService,
  ) {}

  /**
   * Creates a new diagram with validation of project existence
   *
   * @param createDto Diagram creation data
   * @returns Created diagram
   * @throws BadRequestException if project not found
   */
  async create(createDto: DiagramInterface): Promise<Diagram> {
    this.logger.log(`Creating new diagram for project ${createDto.projectId}`);

    try {
      // Validate project existence
      await this.validateProject(createDto.projectId);

      // Validate diagram type
      this.validateDiagramType(createDto.type);

      // Create the diagram
      const diagram = await this.diagramRepository.createDiagram(createDto);
      this.logger.log(`Created diagram with ID ${diagram.id}`);

      return diagram;
    } catch (error) {
      this.handleServiceError(error, "create diagram");
    }
  }

  async findDiagramByRelatedEntityAndType(relatedEntityId: string, type: DiagramType) {
    const diagram = await this.diagramRepository.getDiagramByRelatedEntityAndType(
      relatedEntityId,
      type,
    );
    if (!diagram) {
      throw new NotFoundException("Cannot find diagram with ID");
    }
    return diagram;
  }

  /**
   * Updates an existing diagram with its elements
   *
   * @param id Diagram ID to update
   * @param updateDto Data to update
   * @returns Updated diagram with elements
   * @throws NotFoundException if diagram not found
   */
  async update(id: string, updateDto: UpdateDiagramInterface): Promise<Diagram> {
    this.logger.log(`Updating diagram with ID ${id}`);

    // Validate diagram existence
    await this.findById(id);

    try {
      const updatedDiagram = await this.diagramRepository.updateDiagram(
        id,
        updateDto.name,
        updateDto.nodes,
        updateDto.edges,
      );

      this.logger.log(`Successfully updated diagram ${id}`);
      return updatedDiagram;
    } catch (error) {
      this.handleServiceError(error, "update diagram");
    }
  }

  /**
   * Deletes a diagram and all its elements
   *
   * @param id Diagram ID to delete
   * @returns Operation success status
   * @throws NotFoundException if diagram not found
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting diagram with ID ${id}`);

    // Validate diagram existence
    await this.findById(id);

    try {
      // Perform deletion
      const result = await this.diagramRepository.deleteDiagram(id);

      if (result) {
        this.logger.log(`Successfully deleted diagram ${id}`);
      } else {
        this.logger.warn(`Failed to delete diagram ${id}`);
      }

      return result;
    } catch (error) {
      this.handleServiceError(error, "delete diagram");
    }
  }

  /**
   * Retrieves a diagram by its ID
   *
   * @param id Diagram ID to find
   * @returns Diagram with all elements
   * @throws NotFoundException if diagram not found
   */
  async findById(id: string): Promise<Diagram> {
    this.logger.debug(`Finding diagram by ID ${id}`);

    const diagram = await this.diagramRepository.getDiagramById(id);

    if (!diagram) {
      this.logger.warn(`Diagram with ID ${id} not found`);
      throw new NotFoundException(`Diagram with ID ${id} not found`);
    }

    return diagram;
  }

  /**
   * Lists all diagrams for a project, optionally filtered by type
   *
   * @param projectId Project ID to find diagrams for
   * @param type Optional diagram type filter
   * @returns List of diagrams
   * @throws BadRequestException if project not found
   */
  async listByProject(projectId: string, type?: string): Promise<Diagram[]> {
    this.logger.log(
      `Listing diagrams for project ${projectId}${type ? `, filtered by type: ${type}` : ""}`,
    );

    try {
      // Validate project existence
      await this.validateProject(projectId);

      // If type is provided, validate it
      if (type) {
        this.validateDiagramType(type as DiagramType);
      }

      // Retrieve diagrams
      const diagrams = await this.diagramRepository.getDiagramsByProject(projectId, type);

      this.logger.debug(`Found ${diagrams.length} diagrams for project ${projectId}`);
      return diagrams;
    } catch (error) {
      this.handleServiceError(error, "list diagrams by project");
    }
  }

  /**
   * Validates if a project exists
   *
   * @param projectId Project ID to validate
   * @throws BadRequestException if project not found
   */
  private async validateProject(projectId: string): Promise<void> {
    try {
      await this.projectService.findById(projectId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`Project with ID ${projectId} not found`);
        throw new BadRequestException(`Project with ID ${projectId} not found`);
      }
      throw error;
    }
  }

  /**
   * Validates if a diagram type is supported
   *
   * @param type Diagram type to validate
   * @throws BadRequestException if type is invalid
   */
  private validateDiagramType(type: string): void {
    const validTypes = Object.values(DiagramType);

    if (!validTypes.includes(type as DiagramType)) {
      this.logger.warn(`Invalid diagram type: ${type}`);
      throw new BadRequestException(
        `Invalid diagram type: ${type}. Valid types are: ${validTypes.join(", ")}`,
      );
    }
  }

  /**
   * Handles service errors with appropriate logging and transformation
   *
   * @param error Error to handle
   * @param operation Description of the operation that failed
   * @throws Transformed error
   */
  private handleServiceError(error: any, operation: string): never {
    // Handle already-transformed errors
    if (error instanceof BadRequestException || error instanceof NotFoundException) {
      throw error;
    }

    // Log the error
    this.logger.error(`Failed to ${operation}: ${error.message}`, error.stack);

    // Transform generic errors to BadRequestException
    throw new BadRequestException(`Failed to ${operation}: ${error.message}`);
  }
}

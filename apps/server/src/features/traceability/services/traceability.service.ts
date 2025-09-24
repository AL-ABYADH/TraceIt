import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ModelRegistry, NeogmaModel } from "@repo/custom-neogma";
import { TraceabilityRepository } from "../repositories/traceability.repository";

/**
 * Interface for model relationship configuration
 */
interface RelationshipConfig {
  model: NeogmaModel<any, any> | "self";
  direction?: string;
  name?: string;
  cardinality?: string;
}

/**
 * Service for handling entity traceability and relationship operations
 * Provides methods to retrieve entities with their relationships
 */
@Injectable()
export class TraceabilityService {
  private readonly logger = new Logger(TraceabilityService.name);
  private models: Map<string, NeogmaModel<any, any>>;

  constructor(private readonly traceabilityRepository: TraceabilityRepository) {
    // Initialize models from registry
    this.models = ModelRegistry.getInstance().models;
  }

  /**
   * Retrieves the primary label for an entity
   *
   * @param entityId - The unique identifier of the entity
   * @returns Promise resolving to the primary label of the entity
   * @throws NotFoundException if entity or label not found
   */
  async getEntityLabel(entityId: string): Promise<string> {
    try {
      const labels = await this.traceabilityRepository.getEntityLabels(entityId);

      if (!labels.length) {
        throw new NotFoundException(`Entity not found with ID: ${entityId}`);
      }

      // Get the most specific label (the last one)
      const primaryLabel = labels.at(-1);

      if (!primaryLabel) {
        throw new NotFoundException(`No label found for entity with ID: ${entityId}`);
      }

      return primaryLabel;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error retrieving entity label: ${error.message}`, error.stack);
      throw new Error(`Failed to retrieve entity label: ${error.message}`);
    }
  }

  /**
   * Validates project existence and throws appropriate exception if not found
   *
   * @param projectId - The project identifier to validate
   * @throws NotFoundException if project doesn't exist
   */
  private async validateProject(projectId: string): Promise<void> {
    const exists = await this.traceabilityRepository.projectExists(projectId);

    if (!exists) {
      throw new NotFoundException(`Project not found with ID: ${projectId}`);
    }
  }

  /**
   * Gets the appropriate model for an entity based on its label
   *
   * @param label - The entity type label
   * @returns The corresponding Neogma model
   * @throws NotFoundException if no model exists for the label
   */
  private getModelForLabel(label: string): NeogmaModel<any, any> {
    const model = this.models.get(label);

    if (!model) {
      throw new NotFoundException(`No model registered for label: ${label}`);
    }

    return model;
  }

  /**
   * Gets relationship aliases from a model that match requested relationship types
   *
   * @param model - The entity model
   * @param requestedRelationships - Array of relationship type names
   * @returns Array of relationship aliases that match requested types
   */
  private getMatchingRelationshipAliases(
    model: NeogmaModel<any, any>,
    requestedRelationships: string[],
  ): { include: string[]; exclude: string[] } {
    const aliases: string[] = [];
    const exclude: string[] = [];

    // Iterate through all relationships defined on the model
    Object.entries(model.relationships).forEach(([alias, config]) => {
      const relationshipConfig = config as RelationshipConfig;
      const relatedModel = relationshipConfig?.model;

      // Skip self-referential relationships or undefined models
      if (!relatedModel || relatedModel === "self") {
        return;
      }

      // Get the related model name and check if it's requested
      const modelName = relatedModel.getModelName();
      if (requestedRelationships.includes(modelName)) {
        aliases.push(alias);
      } else {
        exclude.push(alias);
      }
    });

    // console.log(aliases);
    // console.log(exclude);

    return { include: aliases, exclude: exclude };
  }

  /**
   * Retrieves an entity with its relationships
   *
   * @param label - The entity type label
   * @param entityId - Entity ID to retrieve
   * @param projectId - Project context ID
   * @param relationships - Array of relationship types to include
   * @returns Promise resolving to the entity with requested relationships
   * @throws NotFoundException if model or entity not found
   */
  async getEntityWithRelationships(
    label: string,
    entityId: string,
    projectId: string,
    relationships: string[],
  ): Promise<any> {
    try {
      // Validate project exists
      await this.validateProject(projectId);

      // Get the appropriate model for the entity
      const model = this.getModelForLabel(label);

      // Get relationship aliases that match requested types
      // const relationshipAliases = this.getMatchingRelationshipAliases(model, relationships);

      // Fetch entity with relationships
      const entity = await model.findOneWithRelations({
        where: { id: entityId },
        include: relationships,
        // exclude: relationshipAliases["exclude"],
      });

      if (!entity) {
        throw new NotFoundException(`Entity not found with ID: ${entityId}`);
      }

      return entity;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Error retrieving entity with relationships: ${error.message}`,
        error.stack,
      );
      throw new Error(`Failed to retrieve entity with relationships: ${error.message}`);
    }
  }
}

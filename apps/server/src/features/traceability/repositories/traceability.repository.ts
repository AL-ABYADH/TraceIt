import { Injectable, Logger } from "@nestjs/common";
import { Neo4jService } from "src/core/neo4j/neo4j.service";

/**
 * Repository for entity traceability operations in Neo4j
 * Handles low-level database interactions
 */
@Injectable()
export class TraceabilityRepository {
  private readonly logger = new Logger(TraceabilityRepository.name);

  constructor(private readonly neo4jService: Neo4jService) {}

  /**
   * Retrieves the labels (types) of an entity by its ID
   *
   * @param entityId - The unique identifier of the entity
   * @returns Promise resolving to array of labels associated with the entity
   * @throws Error if database query fails
   */
  async getEntityLabels(entityId: string): Promise<string[]> {
    try {
      const query = `
        MATCH (n) 
        WHERE n.id = $entityId 
        RETURN labels(n) as labels
      `;

      const result = await this.neo4jService.getNeogma().queryRunner.run(query, { entityId });

      return result.records[0]?.get("labels") || [];
    } catch (error) {
      this.logger.error(`Failed to retrieve entity labels: ${error.message}`, error.stack);
      throw new Error(`Failed to retrieve entity labels: ${error.message}`);
    }
  }

  /**
   * Checks if a project exists in the database
   *
   * @param projectId - The unique identifier of the project
   * @returns Promise resolving to boolean indicating if project exists
   * @throws Error if database query fails
   */
  async projectExists(projectId: string): Promise<boolean> {
    try {
      const query = `
        MATCH (p:Project) 
        WHERE p.id = $projectId 
        RETURN count(p) > 0 as exists
      `;

      const result = await this.neo4jService.getNeogma().queryRunner.run(query, { projectId });

      return result.records[0]?.get("exists") || false;
    } catch (error) {
      this.logger.error(`Failed to check project existence: ${error.message}`, error.stack);
      throw new Error(`Failed to check project existence: ${error.message}`);
    }
  }
}

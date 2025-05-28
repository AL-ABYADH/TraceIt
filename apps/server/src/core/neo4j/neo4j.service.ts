import { Injectable, Inject } from "@nestjs/common";
import { NEOGMA_TOKEN } from "./neo4j.constants";
import { Neogma } from "@repo/custom-neogma";

/**
 * Service for Neo4j database operations using Neogma.
 * This service can be injected into any other class via dependency injection.
 *
 * @example
 * ```typescript
 * constructor(private readonly neo4jService: Neo4jService) {
 *   // Use neo4jService methods here
 * }
 * ```
 */
@Injectable()
export class Neo4jService {
  constructor(@Inject(NEOGMA_TOKEN) private readonly neogma: Neogma) {}

  /**
   * Returns the Neogma instance.
   * Useful if you need direct access to Neogma methods.
   */
  getNeogma(): Neogma {
    return this.neogma;
  }

  /**
   * Verifies the connectivity with the Neo4j database.
   * Throws an error if the connection is not established.
   *
   * @returns {Promise<boolean>} True if connection is successful.
   */
  async verifyConnectivity(): Promise<boolean> {
    await this.neogma.verifyConnectivity();
    return true;
  }
}

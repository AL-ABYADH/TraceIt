import { Injectable, Inject } from "@nestjs/common";
import { NEOGMA_TOKEN } from "./neo4j.constants";
import { Neogma } from "@repo/custom-neogma";

/**
 * Service for Neo4j database operations using Neogma
 * This service can be easily injected into any class
 *
 * @example
 * ```typescript
 * constructor(private readonly neo4jService: Neo4jService) {
 *   // Use neo4jService here
 * }
 * ```
 */
@Injectable()
export class Neo4jService {
  constructor(@Inject(NEOGMA_TOKEN) private readonly neogma: Neogma) {}

  /**
   * Get the Neogma instance
   * @returns Neogma instance
   */
  getNeogma(): Neogma {
    return this.neogma;
  }

  /**
   * Verify database connectivity
   * @returns true if connected
   */
  async verifyConnectivity(): Promise<boolean> {
    await this.neogma.verifyConnectivity();
    return true;
  }
}

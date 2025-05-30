import { ConfigModule } from "@nestjs/config";
import { Global, Module } from "@nestjs/common";

import { Neo4jService } from "./neo4j.service";
import { Neo4jProvider } from "./neo4j.provider";

/**
 * Global module that provides Neo4j database connectivity throughout the application.
 *
 * Marked as @Global() to make the Neo4jService injectable without needing to import this module
 * in every other module.
 *
 * Required environment variables:
 * - NEO4J_CONNECTION_SCHEME: Connection protocol (e.g., bolt, neo4j)
 * - NEO4J_HOST: Database host address
 * - NEO4J_SERVICE_PORT_EXPOSE or NEO4J_SERVICE_PORT_MAP: Database port
 * - NEO4J_USERNAME: Database username
 * - NEO4J_PASSWORD: Database password
 * - NEO4J_DATABASE: Database name (optional, defaults to 'neo4j')
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [Neo4jProvider, Neo4jService],
  exports: [Neo4jService],
})
export class Neo4jModule {}

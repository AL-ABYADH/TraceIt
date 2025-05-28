import { ConfigModule, ConfigService } from "@nestjs/config";
import { Global, Module, Inject } from "@nestjs/common";
import { NEOGMA_TOKEN } from "./neo4j.constants";
import { Neogma } from "@repo/custom-neogma";
import { Neo4jService } from "./neo4j.service";

/**
 * Factory provider for creating and configuring Neogma instance
 * Handles Neo4j database connection with environment-based configuration
 */
const NeogmaProvider = {
  provide: NEOGMA_TOKEN,
  useFactory: async (configService: ConfigService): Promise<Neogma> => {
    // Determine the correct port from environment variables
    const port = parseInt(
      configService.get("NEO4J_SERVICE_PORT_EXPOSE") ??
        configService.get("NEO4J_SERVICE_PORT_MAP")!.split(":")[0],
    );

    // Construct connection URL from environment variables
    const connectionUrl = `${configService.get("NEO4J_CONNECTION_SCHEME")}://${configService.get("NEO4J_HOST")}:${port}`;

    // Initialize Neogma instance with configuration
    const neogma = new Neogma({
      url: connectionUrl,
      username: configService.get("NEO4J_USERNAME")!,
      password: configService.get("NEO4J_PASSWORD")!,
      database: configService.get("NEO4J_DATABASE") ?? "neo4j", // Default to 'neo4j' if not specified
    });

    try {
      // Verify database connectivity on startup
      await neogma.verifyConnectivity();
      console.log("✅ Neo4j connected successfully");
    } catch (error) {
      console.error("❌ Neo4j connection failed:", error);
      throw error; // Re-throw to prevent application startup with failed DB connection
    }

    return neogma;
  },
  inject: [ConfigService],
};

/**
 * Global module that provides Neo4j database connectivity throughout the application
 * This module is marked as @Global() so it doesn't need to be imported in every module
 *
 * Required environment variables:
 * - NEO4J_CONNECTION_SCHEME: Connection protocol (bolt, neo4j, etc.)
 * - NEO4J_HOST: Database host address
 * - NEO4J_SERVICE_PORT_EXPOSE or NEO4J_SERVICE_PORT_MAP: Database port
 * - NEO4J_USERNAME: Database username
 * - NEO4J_PASSWORD: Database password
 * - NEO4J_DATABASE: Database name (optional, defaults to 'neo4j')
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [NeogmaProvider, Neo4jService],
  exports: [Neo4jService],
})
export class Neo4jGlobalModule {}

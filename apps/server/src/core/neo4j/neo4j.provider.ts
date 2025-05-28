import { ConfigService } from "@nestjs/config";
import { Neogma } from "@repo/custom-neogma";
import { NEOGMA_TOKEN } from "./neo4j.constants";

/**
 * Factory provider for creating and configuring a Neogma instance.
 * Handles Neo4j database connection with environment-based configuration.
 */
export const NeogmaProvider = {
  provide: NEOGMA_TOKEN,
  useFactory: async (configService: ConfigService): Promise<Neogma> => {
    const exposePort = configService.get<string>("NEO4J_SERVICE_PORT_EXPOSE");
    const mappedPort = configService.get<string>("NEO4J_SERVICE_PORT_MAP");

    const portString = exposePort ?? mappedPort?.split(":")[0];

    if (!portString) {
      throw new Error("❌ Neo4j port configuration is missing");
    }

    const port = parseInt(portString);

    const scheme = configService.get<string>("NEO4J_CONNECTION_SCHEME");
    const host = configService.get<string>("NEO4J_HOST");
    const username = configService.get<string>("NEO4J_USERNAME");
    const password = configService.get<string>("NEO4J_PASSWORD");
    const database = configService.get<string>("NEO4J_DATABASE") ?? "neo4j";

    if (!scheme || !host || !username || !password) {
      throw new Error("❌ Missing Neo4j configuration values");
    }

    const connectionUrl = `${scheme}://${host}:${port}`;

    const neogma = new Neogma({
      url: connectionUrl,
      username,
      password,
      database,
    });

    try {
      await neogma.verifyConnectivity();
      console.log("✅ Neo4j connected successfully");
    } catch (error) {
      console.error("❌ Neo4j connection failed:", error);
      throw error;
    }

    return neogma;
  },
  inject: [ConfigService],
};

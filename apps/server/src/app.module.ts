import { Module } from "@nestjs/common";
import { Neo4jGlobalModule } from "./core/neo4j/neo4j.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", ".env.local"],
    }),
    Neo4jGlobalModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

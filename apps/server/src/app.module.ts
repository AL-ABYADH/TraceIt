import { Module } from "@nestjs/common";
import { Neo4jModule } from "./core/neo4j/neo4j.module";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./features/user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", ".env.local"],
    }),
    Neo4jModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

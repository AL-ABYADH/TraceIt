import { Module } from "@nestjs/common";
import { Neo4jModule } from "./core/neo4j/neo4j.module";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./features/user/user.module";
import { ProjectModule } from "./features/project/project.module";
import { AuthModule } from "./core/auth/auth.module";
import { ActorModule } from "./features/actor/actor.module";
import { UseCaseModule } from "./features/use-case/use-case.module";
import { RequirementModule } from "./features/requirement/requirement.module";
import { DiagramModule } from "./features/diagram/diagram.module";
import { ActivityModule } from "./features/activity/activity.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", ".env.local"],
    }),
    Neo4jModule,
    UserModule,
    ProjectModule,
    AuthModule,
    ActorModule,
    UseCaseModule,
    RequirementModule,
    DiagramModule,
    ActivityModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

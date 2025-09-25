import { Module } from "@nestjs/common";
import { DiagramController } from "./controllers/diagram.controller";
import { DiagramService } from "./services/diagram.service";
import { DiagramRepository } from "./repositories/diagram.repository";
import { ProjectModule } from "../project/project.module";

@Module({
  imports: [ProjectModule],
  controllers: [DiagramController],
  providers: [DiagramService, DiagramRepository],
  exports: [DiagramService],
})
export class DiagramModule {}

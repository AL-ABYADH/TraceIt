import { Module } from "@nestjs/common";
import { TraceabilityService } from "./services/traceability.service";
import { TraceabilityRepository } from "./repositories/traceability.repository";
import { TraceabilityController } from "./controllers/traceability.controller";

@Module({
  providers: [TraceabilityService, TraceabilityRepository],
  controllers: [TraceabilityController],
  exports: [TraceabilityService],
})
export class TraceModule {}

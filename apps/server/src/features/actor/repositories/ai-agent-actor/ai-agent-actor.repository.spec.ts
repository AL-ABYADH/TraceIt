import { Test, TestingModule } from "@nestjs/testing";
import { AiAgentActorRepository } from "./ai-agent-actor.repository";

describe("AiAgentActorRepository", () => {
  let service: AiAgentActorRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiAgentActorRepository],
    }).compile();

    service = module.get<AiAgentActorRepository>(AiAgentActorRepository);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from "@nestjs/testing";
import { HumanActorRepository } from "./human-actor.repository";

describe("HumanActorRepository", () => {
  let service: HumanActorRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HumanActorRepository],
    }).compile();

    service = module.get<HumanActorRepository>(HumanActorRepository);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});

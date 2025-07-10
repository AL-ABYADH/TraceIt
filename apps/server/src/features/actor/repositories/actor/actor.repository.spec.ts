import { Test, TestingModule } from "@nestjs/testing";
import { ActorRepository } from "./actor.repository";

describe("ActorRepository", () => {
  let service: ActorRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActorRepository],
    }).compile();

    service = module.get<ActorRepository>(ActorRepository);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});

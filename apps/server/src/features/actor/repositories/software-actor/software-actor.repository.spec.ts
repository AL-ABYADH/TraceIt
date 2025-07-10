import { Test, TestingModule } from "@nestjs/testing";
import { SoftwareActorRepository } from "./software-actor.repository";

describe("SoftwareActorRepository", () => {
  let service: SoftwareActorRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SoftwareActorRepository],
    }).compile();

    service = module.get<SoftwareActorRepository>(SoftwareActorRepository);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});

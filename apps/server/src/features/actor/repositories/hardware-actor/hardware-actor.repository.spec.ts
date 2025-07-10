import { Test, TestingModule } from "@nestjs/testing";
import { HardwareActorRepository } from "./hardware-actor.repository";

describe("HardwareActorRepository", () => {
  let service: HardwareActorRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HardwareActorRepository],
    }).compile();

    service = module.get<HardwareActorRepository>(HardwareActorRepository);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});

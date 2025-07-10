import { Test, TestingModule } from "@nestjs/testing";
import { EventActorRepository } from "./event-actor.repository";

describe("EventActorRepository", () => {
  let service: EventActorRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventActorRepository],
    }).compile();

    service = module.get<EventActorRepository>(EventActorRepository);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});

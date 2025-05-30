import { Test, TestingModule } from "@nestjs/testing";
import { ProjectCollaborationRepository } from "./project-collaboration.repository";

describe("ProjectCollaborationRepository", () => {
  let repository: ProjectCollaborationRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectCollaborationRepository],
    }).compile();

    repository = module.get<ProjectCollaborationRepository>(ProjectCollaborationRepository);
  });

  it("should be defined", () => {
    expect(repository).toBeDefined();
  });
});

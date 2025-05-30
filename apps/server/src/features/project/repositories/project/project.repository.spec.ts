import { Test, TestingModule } from "@nestjs/testing";
import { ProjectRepository } from "./project.repository";

describe("ProjectRepository", () => {
  let repository: ProjectRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectRepository],
    }).compile();

    repository = module.get<ProjectRepository>(ProjectRepository);
  });

  it("should be defined", () => {
    expect(repository).toBeDefined();
  });
});

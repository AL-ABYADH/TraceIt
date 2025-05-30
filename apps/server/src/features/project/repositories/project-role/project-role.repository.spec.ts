import { Test, TestingModule } from "@nestjs/testing";
import { ProjectRoleRepository } from "./project-role.repository";

describe("ProjectRoleRepository", () => {
  let repository: ProjectRoleRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectRoleRepository],
    }).compile();

    repository = module.get<ProjectRoleRepository>(ProjectRoleRepository);
  });

  it("should be defined", () => {
    expect(repository).toBeDefined();
  });
});

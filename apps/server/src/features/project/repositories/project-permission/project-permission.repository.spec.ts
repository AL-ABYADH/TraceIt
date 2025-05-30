import { Test, TestingModule } from "@nestjs/testing";
import { ProjectPermissionRepository } from "./project-permission.repository";

describe("ProjectPermissionRepository", () => {
  let repository: ProjectPermissionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectPermissionRepository],
    }).compile();

    repository = module.get<ProjectPermissionRepository>(ProjectPermissionRepository);
  });

  it("should be defined", () => {
    expect(repository).toBeDefined();
  });
});

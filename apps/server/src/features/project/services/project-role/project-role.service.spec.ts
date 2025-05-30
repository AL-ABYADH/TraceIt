import { Test, TestingModule } from "@nestjs/testing";
import { ProjectRoleService } from "./project-role.service";

describe("ProjectRoleService", () => {
  let service: ProjectRoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectRoleService],
    }).compile();

    service = module.get<ProjectRoleService>(ProjectRoleService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});

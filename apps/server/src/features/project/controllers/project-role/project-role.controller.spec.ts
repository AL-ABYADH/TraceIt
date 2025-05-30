import { Test, TestingModule } from "@nestjs/testing";
import { ProjectRoleController } from "./project-role.controller";

describe("ProjectRoleController", () => {
  let controller: ProjectRoleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectRoleController],
    }).compile();

    controller = module.get<ProjectRoleController>(ProjectRoleController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});

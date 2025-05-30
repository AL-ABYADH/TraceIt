import { Test, TestingModule } from "@nestjs/testing";
import { ProjectCollaborationController } from "./project-collaboration.controller";

describe("ProjectCollaborationController", () => {
  let controller: ProjectCollaborationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectCollaborationController],
    }).compile();

    controller = module.get<ProjectCollaborationController>(ProjectCollaborationController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});

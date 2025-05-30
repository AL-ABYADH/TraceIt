import { Test, TestingModule } from "@nestjs/testing";
import { ProjectInvitationController } from "./project-invitation.controller";

describe("ProjectInvitationController", () => {
  let controller: ProjectInvitationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectInvitationController],
    }).compile();

    controller = module.get<ProjectInvitationController>(ProjectInvitationController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});

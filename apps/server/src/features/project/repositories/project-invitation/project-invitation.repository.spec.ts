import { Test, TestingModule } from "@nestjs/testing";
import { ProjectInvitationRepository } from "./project-invitation.repository";

describe("ProjectInvitationRepository", () => {
  let repository: ProjectInvitationRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectInvitationRepository],
    }).compile();

    repository = module.get<ProjectInvitationRepository>(ProjectInvitationRepository);
  });

  it("should be defined", () => {
    expect(repository).toBeDefined();
  });
});

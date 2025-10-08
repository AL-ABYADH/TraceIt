import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ProjectService } from "src/features/project/services/project/project.service";
import { RequirementExceptionService } from "src/features/requirement/services/requirement-exception.service";
import { RequirementService } from "src/features/requirement/services/requirement.service";
import { SecondaryUseCaseRepository } from "../../repositories/secondary-use-case/secondary-use-case.repository";
import { PrimaryUseCaseService } from "../primary-use-case/primary-use-case.service";
import { SecondaryUseCaseService } from "./secondary-use-case.service";

describe("SecondaryUseCaseService", () => {
  let service: SecondaryUseCaseService;
  let repo: jest.Mocked<SecondaryUseCaseRepository>;
  let projectService: jest.Mocked<ProjectService>;
  let primaryUseCaseService: jest.Mocked<PrimaryUseCaseService>;
  let requirementService: jest.Mocked<RequirementService>;
  let exceptionService: jest.Mocked<RequirementExceptionService>;

  const mockSecondaryUseCase = {
    id: "SUC1",
    name: "Sub Feature",
    subtype: "Functional",
    createdAt: "2025-10-08T12:00:00Z",
    updatedAt: "2025-10-08T12:00:00Z",
    parentUseCase: "PUC1",
  };

  const mockRequirement = {
    id: "R1",
    nestedRequirements: [{ id: "NR1" }],
  };

  const mockException = {
    id: "E1",
    requirements: [{ id: "R2" }],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SecondaryUseCaseService,
        {
          provide: SecondaryUseCaseRepository,
          useValue: {
            create: jest.fn(),
            getById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            getAll: jest.fn(),
            getByProject: jest.fn(),
          },
        },
        {
          provide: ProjectService,
          useValue: { findById: jest.fn() },
        },
        {
          provide: PrimaryUseCaseService,
          useValue: { findById: jest.fn() },
        },
        {
          provide: RequirementService,
          useValue: { findById: jest.fn(), setParentRequirementToSecondaryUseCase: jest.fn() },
        },
        {
          provide: RequirementExceptionService,
          useValue: { findById: jest.fn(), setExceptionToSecondaryUseCase: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(SecondaryUseCaseService);
    repo = module.get(SecondaryUseCaseRepository);
    projectService = module.get(ProjectService);
    primaryUseCaseService = module.get(PrimaryUseCaseService);
    requirementService = module.get(RequirementService);
    exceptionService = module.get(RequirementExceptionService);
  });

  describe("create", () => {
    it("should create a secondary use case from a requirement with nested requirements", async () => {
      const dto = { projectId: "P1", primaryUseCaseId: "PUC1", requirementId: "R1" };
      projectService.findById.mockResolvedValue({ id: "P1" } as any);
      primaryUseCaseService.findById.mockResolvedValue({ id: "PUC1" } as any);
      requirementService.findById.mockResolvedValue(mockRequirement as any);
      repo.create.mockResolvedValue(mockSecondaryUseCase as any);

      const result = await service.create(dto as any);
      expect(result).toEqual(mockSecondaryUseCase);
      expect(requirementService.setParentRequirementToSecondaryUseCase).toHaveBeenCalledWith(
        "R1",
        "SUC1",
      );
    });

    it("should create a secondary use case from an exception with requirements", async () => {
      const dto = { projectId: "P1", primaryUseCaseId: "PUC1", exceptionId: "E1" };
      projectService.findById.mockResolvedValue({ id: "P1" } as any);
      primaryUseCaseService.findById.mockResolvedValue({ id: "PUC1" } as any);
      exceptionService.findById.mockResolvedValue(mockException as any);
      repo.create.mockResolvedValue(mockSecondaryUseCase as any);

      const result = await service.create(dto as any);
      expect(result).toEqual(mockSecondaryUseCase);
      expect(exceptionService.setExceptionToSecondaryUseCase).toHaveBeenCalledWith("E1", "SUC1");
    });

    it("should throw BadRequestException if no requirementId or exceptionId provided", async () => {
      const dto = { projectId: "P1", primaryUseCaseId: "PUC1" } as any;
      projectService.findById.mockResolvedValue({ id: "P1" } as any);
      primaryUseCaseService.findById.mockResolvedValue({ id: "PUC1" } as any);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe("update", () => {
    it("should update secondary use case", async () => {
      repo.getById.mockResolvedValue(mockSecondaryUseCase as any);
      repo.update.mockResolvedValue({ ...mockSecondaryUseCase, name: "Updated" } as any);

      const result = await service.update("SUC1", { name: "Updated" });
      expect(result.name).toBe("Updated");
    });

    it("should throw BadRequestException if primaryUseCaseId not found", async () => {
      repo.getById.mockResolvedValue(mockSecondaryUseCase as any);
      primaryUseCaseService.findById.mockRejectedValue(new NotFoundException());

      await expect(service.update("SUC1", { primaryUseCaseId: "PUC99" })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe("changePrimaryUseCase", () => {
    it("should change primary use case successfully", async () => {
      repo.getById.mockResolvedValue(mockSecondaryUseCase as any);
      primaryUseCaseService.findById.mockResolvedValue({ id: "PUC2" } as any);
      repo.update.mockResolvedValue({ ...mockSecondaryUseCase, parentUseCase: "PUC2" } as any);

      const result = await service.changePrimaryUseCase("SUC1", "PUC2");
      expect(result.parentUseCase).toBe("PUC2");
    });

    it("should throw BadRequestException if primary use case not found", async () => {
      repo.getById.mockResolvedValue(mockSecondaryUseCase as any);
      primaryUseCaseService.findById.mockRejectedValue(new NotFoundException());

      await expect(service.changePrimaryUseCase("SUC1", "PUC99")).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe("remove", () => {
    it("should remove secondary use case", async () => {
      repo.getById.mockResolvedValue(mockSecondaryUseCase as any);
      repo.delete.mockResolvedValue(true);
      const result = await service.remove("SUC1");
      expect(result).toBe(true);
    });

    it("should throw NotFoundException if not found", async () => {
      repo.getById.mockResolvedValue(null);
      await expect(service.remove("SUC99")).rejects.toThrow(NotFoundException);
    });
  });

  describe("findById", () => {
    it("should return secondary use case", async () => {
      repo.getById.mockResolvedValue(mockSecondaryUseCase as any);
      const result = await service.findById("SUC1");
      expect(result).toEqual(mockSecondaryUseCase);
    });

    it("should throw NotFoundException if not found", async () => {
      repo.getById.mockResolvedValue(null);
      await expect(service.findById("SUC99")).rejects.toThrow(NotFoundException);
    });
  });

  describe("findAll", () => {
    it("should return all secondary use cases", async () => {
      repo.getAll.mockResolvedValue([mockSecondaryUseCase as any]);
      const result = await service.findAll();
      expect(result).toEqual([mockSecondaryUseCase]);
    });
  });

  describe("listByProject", () => {
    it("should list secondary use cases for project", async () => {
      projectService.findById.mockResolvedValue({ id: "P1" } as any);
      repo.getByProject.mockResolvedValue([mockSecondaryUseCase as any]);

      const result = await service.listByProject("P1");
      expect(result).toEqual([mockSecondaryUseCase]);
    });

    it("should throw BadRequestException if project not found", async () => {
      projectService.findById.mockRejectedValue(new NotFoundException());
      await expect(service.listByProject("P99")).rejects.toThrow(BadRequestException);
    });
  });
});

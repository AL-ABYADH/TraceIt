import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { UseCaseImportanceLevel } from "@repo/shared-schemas";
import { ActorService } from "src/features/actor/services/actor/actor.service";
import { ProjectService } from "src/features/project/services/project/project.service";
import { PrimaryUseCaseRepository } from "../../repositories/primary-use-case/primary-use-case.repository";
import { PrimaryUseCaseService } from "./primary-use-case.service";

describe("PrimaryUseCaseService", () => {
  let service: PrimaryUseCaseService;
  let repo: jest.Mocked<PrimaryUseCaseRepository>;
  let projectService: jest.Mocked<ProjectService>;
  let actorService: jest.Mocked<ActorService>;

  const mockUseCase = {
    id: "UC1",
    name: "Login Feature",
    subtype: UseCaseImportanceLevel.HIGH,
    importanceLevel: "High",
    createdAt: "2025-10-08T12:00:00Z",
    updatedAt: "2025-10-08T12:00:00Z",
    primaryActors: [],
    secondaryActors: [],
    secondaryUseCases: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrimaryUseCaseService,
        {
          provide: PrimaryUseCaseRepository,
          useValue: {
            create: jest.fn(),
            getById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            getByProject: jest.fn(),
          },
        },
        {
          provide: ProjectService,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: ActorService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PrimaryUseCaseService>(PrimaryUseCaseService);
    repo = module.get(PrimaryUseCaseRepository);
    projectService = module.get(ProjectService);
    actorService = module.get(ActorService);
  });

  describe("create", () => {
    it("should create a primary use case successfully", async () => {
      const dto = {
        name: "Register Feature",
        projectId: "P1",
        subtype: UseCaseImportanceLevel.HIGH,
        importanceLevel: "Medium",
        primaryActorIds: ["A1"],
        secondaryActorIds: ["A2"],
      };
      projectService.findById.mockResolvedValue({ id: "P1" } as any);
      actorService.findById.mockResolvedValue({ id: "A1" } as any);
      actorService.findById.mockResolvedValueOnce({ id: "A2" } as any);
      repo.create.mockResolvedValue(mockUseCase as any);

      const result = await service.create(dto as any);
      expect(result).toEqual(mockUseCase);
      expect(repo.create).toHaveBeenCalledWith(dto);
    });

    it("should throw BadRequestException if project not found", async () => {
      const dto = { name: "Test", projectId: "P99" } as any;
      projectService.findById.mockRejectedValue(new NotFoundException());

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe("update", () => {
    it("should update primary use case", async () => {
      const updateDto = { name: "Updated Feature" };
      repo.update.mockResolvedValue({ ...mockUseCase, ...updateDto } as any);

      const result = await service.update("UC1", updateDto);
      expect(result.name).toBe("Updated Feature");
      expect(repo.update).toHaveBeenCalledWith("UC1", updateDto);
    });
  });

  describe("findById", () => {
    it("should return a primary use case", async () => {
      repo.getById.mockResolvedValue(mockUseCase as any);
      const result = await service.findById("UC1");
      expect(result).toEqual(mockUseCase);
    });

    it("should throw NotFoundException if not found", async () => {
      repo.getById.mockResolvedValue(null);
      await expect(service.findById("UC99")).rejects.toThrow(NotFoundException);
    });
  });

  describe("listByProject", () => {
    it("should return list of primary use cases", async () => {
      repo.getByProject.mockResolvedValue([mockUseCase as any]);
      const result = await service.listByProject("P1");
      expect(result).toEqual([mockUseCase]);
    });

    it("should throw NotFoundException if project not found", async () => {
      repo.getByProject.mockRejectedValue(new NotFoundException());
      await expect(service.listByProject("P99")).rejects.toThrow(NotFoundException);
    });
  });

  describe("remove", () => {
    it("should remove a primary use case", async () => {
      repo.getById.mockResolvedValue(mockUseCase as any);
      repo.delete.mockResolvedValue(true);
      const result = await service.remove("UC1");
      expect(result).toBe(true);
    });

    it("should throw NotFoundException if use case not found", async () => {
      repo.getById.mockResolvedValue(null);
      await expect(service.remove("UC99")).rejects.toThrow(NotFoundException);
    });
  });

  describe("actor management", () => {
    it("should add primary actors", async () => {
      const updatedUseCase = { ...mockUseCase, primaryActors: [{ id: "A1" }] };
      repo.getById.mockResolvedValue(mockUseCase as any);
      actorService.findById.mockResolvedValue({ id: "A1" } as any);
      repo.update.mockResolvedValue(updatedUseCase as any);

      const result = await service.addPrimaryActors("UC1", ["A1"]);
      expect(result.primaryActors).toEqual([{ id: "A1" }]);
      expect(repo.update).toHaveBeenCalledWith("UC1", { primaryActorIds: ["A1"] });
    });

    it("should remove primary actors", async () => {
      const useCaseWithActors = { ...mockUseCase, primaryActors: [{ id: "A1" }, { id: "A2" }] };
      repo.getById.mockResolvedValue(useCaseWithActors as any);
      actorService.findById.mockResolvedValue({ id: "A1" } as any);
      repo.update.mockResolvedValue({ ...mockUseCase, primaryActors: [{ id: "A2" }] } as any);

      const result = await service.removePrimaryActors("UC1", ["A1"]);
      expect(result.primaryActors).toEqual([{ id: "A2" }]);
    });

    it("should add secondary actors", async () => {
      const updatedUseCase = { ...mockUseCase, secondaryActors: [{ id: "A2" }] };
      repo.getById.mockResolvedValue(mockUseCase as any);
      actorService.findById.mockResolvedValue({ id: "A2" } as any);
      repo.update.mockResolvedValue(updatedUseCase as any);

      const result = await service.addSecondaryActors("UC1", ["A2"]);
      expect(result.secondaryActors).toEqual([{ id: "A2" }]);
    });

    it("should remove secondary actors", async () => {
      const useCaseWithActors = { ...mockUseCase, secondaryActors: [{ id: "A2" }, { id: "A3" }] };
      repo.getById.mockResolvedValue(useCaseWithActors as any);
      repo.update.mockResolvedValue({ ...mockUseCase, secondaryActors: [{ id: "A3" }] } as any);

      const result = await service.removeSecondaryActors("UC1", ["A2"]);
      expect(result.secondaryActors).toEqual([{ id: "A3" }]);
    });
  });
});

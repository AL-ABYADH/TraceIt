import { Test, TestingModule } from "@nestjs/testing";
import { ProjectService } from "./project.service";
import { ProjectRepository } from "../../repositories/project/project.repository";
import { NotFoundException } from "@nestjs/common";
import { ProjectStatus } from "../../enums/project-status.enum";

describe("ProjectService", () => {
  let service: ProjectService;
  let repository: ProjectRepository;

  const mockProject = {
    id: "1",
    name: "Test Project",
    description: "A sample project",
    status: ProjectStatus.ACTIVE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockRepository = {
    create: jest.fn(),
    getById: jest.fn(),
    getProjects: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    setStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectService, { provide: ProjectRepository, useValue: mockRepository }],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
    repository = module.get<ProjectRepository>(ProjectRepository);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a project", async () => {
      mockRepository.create.mockResolvedValue(mockProject);

      const result = await service.create({
        name: mockProject.name,
        description: mockProject.description,
        userId: "user1",
      });

      expect(result).toEqual(mockProject);
      expect(mockRepository.create).toHaveBeenCalledWith({
        name: mockProject.name,
        description: mockProject.description,
        ownerId: "user1",
      });
    });
  });

  describe("findById", () => {
    it("should return a project if found", async () => {
      mockRepository.getById.mockResolvedValue(mockProject);

      const result = await service.findById("1");
      expect(result).toEqual(mockProject);
      expect(mockRepository.getById).toHaveBeenCalledWith("1");
    });

    it("should throw NotFoundException if project not found", async () => {
      mockRepository.getById.mockResolvedValue(null);

      await expect(service.findById("1")).rejects.toThrow(NotFoundException);
    });
  });

  describe("listUserProjects", () => {
    it("should list projects for a user", async () => {
      mockRepository.getProjects.mockResolvedValue([mockProject]);

      const result = await service.listUserProjects("user1");
      expect(result).toEqual([mockProject]);
      expect(mockRepository.getProjects).toHaveBeenCalledWith("user1", undefined);
    });

    it("should list projects for a user with status filter", async () => {
      mockRepository.getProjects.mockResolvedValue([mockProject]);

      const result = await service.listUserProjects("user1", ProjectStatus.ACTIVE);
      expect(result).toEqual([mockProject]);
      expect(mockRepository.getProjects).toHaveBeenCalledWith("user1", ProjectStatus.ACTIVE);
    });
  });

  describe("update", () => {
    it("should update a project", async () => {
      mockRepository.getById.mockResolvedValue(mockProject);
      mockRepository.update.mockResolvedValue({ ...mockProject, name: "Updated Project" });

      const result = await service.update("1", { name: "Updated Project" });
      expect(result.name).toEqual("Updated Project");
      expect(mockRepository.update).toHaveBeenCalledWith("1", { name: "Updated Project" });
    });

    it("should throw NotFoundException if project not found", async () => {
      mockRepository.getById.mockResolvedValue(null);

      await expect(service.update("1", { name: "Updated Project" })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("delete", () => {
    it("should delete a project", async () => {
      mockRepository.getById.mockResolvedValue(mockProject);
      mockRepository.delete.mockResolvedValue(true);

      const result = await service.delete("1");
      expect(result).toBe(true);
      expect(mockRepository.delete).toHaveBeenCalledWith("1");
    });

    it("should throw NotFoundException if project not found", async () => {
      mockRepository.getById.mockResolvedValue(null);

      await expect(service.delete("1")).rejects.toThrow(NotFoundException);
    });
  });

  describe("activate", () => {
    it("should set project status to ACTIVE", async () => {
      mockRepository.getById.mockResolvedValue(mockProject);
      mockRepository.setStatus.mockResolvedValue(true);

      const result = await service.activate("1");
      expect(result).toBe(true);
      expect(mockRepository.setStatus).toHaveBeenCalledWith("1", ProjectStatus.ACTIVE);
    });
  });

  describe("archive", () => {
    it("should set project status to ARCHIVED", async () => {
      mockRepository.getById.mockResolvedValue(mockProject);
      mockRepository.setStatus.mockResolvedValue(true);

      const result = await service.archive("1");
      expect(result).toBe(true);
      expect(mockRepository.setStatus).toHaveBeenCalledWith("1", ProjectStatus.ARCHIVED);
    });
  });
});

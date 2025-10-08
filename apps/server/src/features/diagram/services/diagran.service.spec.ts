import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { DiagramType } from "@repo/shared-schemas";
import { ProjectService } from "../../project/services/project/project.service";
import { Diagram } from "../entities/diagram.entity";
import { DiagramRepository } from "../repositories/diagram.repository";
import { DiagramService } from "./diagram.service";

describe("DiagramService", () => {
  let service: DiagramService;
  let repo: jest.Mocked<DiagramRepository>;
  let projectService: jest.Mocked<ProjectService>;

  const mockDiagram: Diagram = {
    id: "D1",
    name: "Test Diagram",
    type: DiagramType.ACTIVITY,
    nodes: [],
    edges: [],
    createdAt: "2025-10-08T12:00:00Z",
    updatedAt: "2025-10-08T12:00:00Z",
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiagramService,
        {
          provide: DiagramRepository,
          useValue: {
            createDiagram: jest.fn(),
            getDiagramById: jest.fn(),
            updateDiagram: jest.fn(),
            deleteDiagram: jest.fn(),
            getDiagramByRelatedEntityAndType: jest.fn(),
            getDiagramsByProject: jest.fn(),
          },
        },
        {
          provide: ProjectService,
          useValue: { findById: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(DiagramService);
    repo = module.get(DiagramRepository);
    projectService = module.get(ProjectService);
  });

  describe("create", () => {
    it("should create a diagram successfully", async () => {
      projectService.findById.mockResolvedValue({ id: "P1" } as any);
      repo.createDiagram.mockResolvedValue(mockDiagram);

      const result = await service.create({
        name: "Test Diagram",
        type: DiagramType.ACTIVITY,
        projectId: "P1",
        relatedEntityId: "R1",
      });

      expect(result).toEqual(mockDiagram);
      expect(repo.createDiagram).toHaveBeenCalledWith({
        name: "Test Diagram",
        type: DiagramType.ACTIVITY,
        projectId: "P1",
        relatedEntityId: "R1",
      });
    });

    it("should throw BadRequestException for invalid diagram type", async () => {
      projectService.findById.mockResolvedValue({ id: "P1" } as any);

      await expect(
        service.create({
          name: "Test",
          type: "InvalidType" as any,
          projectId: "P1",
          relatedEntityId: "R1",
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it("should throw BadRequestException if project not found", async () => {
      projectService.findById.mockRejectedValue(new NotFoundException());

      await expect(
        service.create({
          name: "Test",
          type: DiagramType.ACTIVITY,
          projectId: "P99",
          relatedEntityId: "R1",
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("findById", () => {
    it("should return diagram by ID", async () => {
      repo.getDiagramById.mockResolvedValue(mockDiagram as any);

      const result = await service.findById("D1");
      expect(result).toEqual(mockDiagram);
    });

    it("should throw NotFoundException if diagram not found", async () => {
      repo.getDiagramById.mockResolvedValue(null);

      await expect(service.findById("D99")).rejects.toThrow(NotFoundException);
    });
  });

  describe("findDiagramByRelatedEntityAndType", () => {
    it("should return diagram when found", async () => {
      repo.getDiagramByRelatedEntityAndType.mockResolvedValue(mockDiagram as any);

      const result = await service.findDiagramByRelatedEntityAndType(
        "Entity1",
        DiagramType.ACTIVITY,
      );
      expect(result).toEqual(mockDiagram);
    });

    it("should throw NotFoundException if diagram not found", async () => {
      repo.getDiagramByRelatedEntityAndType.mockResolvedValue(null);

      await expect(
        service.findDiagramByRelatedEntityAndType("Entity1", DiagramType.ACTIVITY),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("update", () => {
    it("should update diagram successfully", async () => {
      repo.getDiagramById.mockResolvedValue(mockDiagram as any);
      repo.updateDiagram.mockResolvedValue({ ...mockDiagram, name: "Updated" } as any);

      const result = await service.update("D1", { name: "Updated", nodes: [], edges: [] });
      expect(result.name).toBe("Updated");
    });

    it("should throw NotFoundException if diagram to update not found", async () => {
      repo.getDiagramById.mockResolvedValue(null);

      await expect(
        service.update("D99", { name: "Updated", nodes: [], edges: [] }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("delete", () => {
    it("should delete diagram successfully", async () => {
      repo.getDiagramById.mockResolvedValue(mockDiagram as any);
      repo.deleteDiagram.mockResolvedValue(true);

      const result = await service.delete("D1");
      expect(result).toBe(true);
    });

    it("should throw NotFoundException if diagram to delete not found", async () => {
      repo.getDiagramById.mockResolvedValue(null);
      await expect(service.delete("D99")).rejects.toThrow(NotFoundException);
    });
  });

  describe("listByProject", () => {
    it("should list diagrams for a project", async () => {
      projectService.findById.mockResolvedValue({ id: "P1" } as any);
      repo.getDiagramsByProject.mockResolvedValue([mockDiagram] as any);

      const result = await service.listByProject("P1");
      expect(result).toEqual([mockDiagram]);
    });

    it("should throw BadRequestException if project not found", async () => {
      projectService.findById.mockRejectedValue(new NotFoundException());
      await expect(service.listByProject("P99")).rejects.toThrow(BadRequestException);
    });

    it("should throw BadRequestException for invalid diagram type", async () => {
      projectService.findById.mockResolvedValue({ id: "P1" } as any);
      await expect(service.listByProject("P1", "InvalidType")).rejects.toThrow(BadRequestException);
    });
  });
});

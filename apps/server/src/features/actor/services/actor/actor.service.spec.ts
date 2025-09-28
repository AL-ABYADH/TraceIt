import { Test, TestingModule } from "@nestjs/testing";
import { ActorService } from "./actor.service";
import { ActorRepositoryFactory } from "../../repositories/factory/actor-repository.factory";
import { ProjectService } from "../../../project/services/project/project.service";
import { ActorRepository } from "../../repositories/actor/actor.repository";
import { Actor } from "../../entities/actor.entity";
import ActorSubtype from "../../enums/actor-subtype.enum";
import ActorType from "../../enums/actor-type.enum";
import { NotFoundException, BadRequestException } from "@nestjs/common";
import { AddActorParamsInterface } from "../../interfaces/add-actor-params.interface";

describe("ActorService", () => {
  let service: ActorService;
  let repositoryFactory: ActorRepositoryFactory;
  let projectService: ProjectService;
  let actorRepo: ActorRepository;

  const mockActor: Actor = {
    id: "1",
    name: "Test Actor",
    type: ActorType.ACTUAL,
    subtype: ActorSubtype.HUMAN,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockRepository = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActorService,
        {
          provide: ActorRepositoryFactory,
          useValue: {
            getConcreteRepository: jest.fn().mockReturnValue(mockRepository),
          },
        },
        {
          provide: ProjectService,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: ActorRepository,
          useValue: {
            getAllByProject: jest.fn(),
            getByProjectAndSubtype: jest.fn(),
            getByProjectAndType: jest.fn(),
            getById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ActorService>(ActorService);
    repositoryFactory = module.get<ActorRepositoryFactory>(ActorRepositoryFactory);
    projectService = module.get<ProjectService>(ProjectService);
    actorRepo = module.get<ActorRepository>(ActorRepository);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("add", () => {
    it("should add a new actor successfully", async () => {
      const dto: AddActorParamsInterface = {
        name: "New Actor",
        projectId: "proj1",
        subType: ActorSubtype.HUMAN,
      };
      mockRepository.create.mockResolvedValue(mockActor);

      const result = await service.add(dto);
      expect(projectService.findById).toHaveBeenCalledWith(dto.projectId);
      expect(repositoryFactory.getConcreteRepository).toHaveBeenCalledWith(dto.subType);
      expect(mockRepository.create).toHaveBeenCalledWith({
        name: dto.name,
        projectId: dto.projectId,
      });
      expect(result).toEqual(mockActor);
    });
  });

  describe("listProjectActors", () => {
    it("should return all actors for a project", async () => {
      (actorRepo.getAllByProject as jest.Mock).mockResolvedValue([mockActor]);
      const result = await service.listProjectActors("proj1");
      expect(actorRepo.getAllByProject).toHaveBeenCalledWith("proj1");
      expect(result).toEqual([mockActor]);
    });
  });

  describe("listProjectActorsBySubtype", () => {
    it("should return actors by subtype", async () => {
      (projectService.findById as jest.Mock).mockResolvedValue({});
      (actorRepo.getByProjectAndSubtype as jest.Mock).mockResolvedValue([mockActor]);

      const result = await service.listProjectActorsBySubtype("proj1", ActorSubtype.HUMAN);
      expect(projectService.findById).toHaveBeenCalledWith("proj1");
      expect(actorRepo.getByProjectAndSubtype).toHaveBeenCalledWith("proj1", ActorSubtype.HUMAN);
      expect(result).toEqual([mockActor]);
    });
  });

  describe("listProjectActorsByType", () => {
    it("should return actors by type", async () => {
      (projectService.findById as jest.Mock).mockResolvedValue({});
      (actorRepo.getByProjectAndType as jest.Mock).mockResolvedValue([mockActor]);

      const result = await service.listProjectActorsByType("proj1", ActorType.ACTUAL);
      expect(projectService.findById).toHaveBeenCalledWith("proj1");
      expect(actorRepo.getByProjectAndType).toHaveBeenCalledWith("proj1", ActorType.ACTUAL);
      expect(result).toEqual([mockActor]);
    });
  });

  describe("findById", () => {
    it("should return the actor if found", async () => {
      (actorRepo.getById as jest.Mock).mockResolvedValue(mockActor);
      const result = await service.findById("1");
      expect(actorRepo.getById).toHaveBeenCalledWith("1");
      expect(result).toEqual(mockActor);
    });

    it("should throw NotFoundException if actor not found", async () => {
      (actorRepo.getById as jest.Mock).mockResolvedValue(null);
      await expect(service.findById("unknown")).rejects.toThrow(NotFoundException);
    });
  });

  describe("update", () => {
    it("should update actor successfully", async () => {
      jest.spyOn(service, "findById").mockResolvedValueOnce(mockActor);
      mockRepository.update.mockResolvedValue({
        ...mockActor,
        name: "Updated Name",
      });

      const result = await service.update("1", { name: "Updated Name" });
      expect(repositoryFactory.getConcreteRepository).toHaveBeenCalledWith(mockActor.subtype);
      expect(mockRepository.update).toHaveBeenCalledWith("1", { name: "Updated Name" });
      expect(result.name).toBe("Updated Name");
    });

    it("should throw BadRequestException if name is the same", async () => {
      jest.spyOn(service, "findById").mockResolvedValueOnce(mockActor);

      await expect(service.update("1", { name: mockActor.name })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe("remove", () => {
    it("should delete actor successfully", async () => {
      jest.spyOn(service, "findById").mockResolvedValueOnce(mockActor);
      mockRepository.delete.mockResolvedValue(true);

      const result = await service.remove("1");
      expect(repositoryFactory.getConcreteRepository).toHaveBeenCalledWith(mockActor.subtype);
      expect(mockRepository.delete).toHaveBeenCalledWith("1");
      expect(result).toBe(true);
    });
  });
});

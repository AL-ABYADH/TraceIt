import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ActorService } from "src/features/actor/services/actor/actor.service";
import { UseCaseService } from "src/features/use-case/services/use-case/use-case.service";
import { Requirement } from "../entities/requirement.entity";
import { ExceptionalRequirementRepository } from "../repositories/exceptional-requirement.repository";
import { RequirementRepository } from "../repositories/requirement.repository";
import { RequirementService } from "./requirement.service";
import { PrimaryUseCaseRepository } from "src/features/use-case/repositories/primary-use-case/primary-use-case.repository";

describe("RequirementService", () => {
  let service: RequirementService;
  let requirementRepo: jest.Mocked<RequirementRepository>;
  let exceptionRepo: jest.Mocked<ExceptionalRequirementRepository>;
  let useCaseService: jest.Mocked<UseCaseService>;
  let actorService: jest.Mocked<ActorService>;

  const mockRequirement: Requirement = {
    id: "1",
    operation: "Login",
    condition: "Valid credentials",
    createdAt: "2025-10-08T12:00:00Z",
    updatedAt: "2025-10-08T12:00:00Z",
    nestedRequirements: [],
    exceptions: [],
    isActivityStale: true,
    isConditionStale: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequirementService,
        {
          provide: RequirementRepository,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            getById: jest.fn(),
            getByUseCase: jest.fn(),
            addNestedRequirement: jest.fn(),
            removeNestedRequirement: jest.fn(),
            addException: jest.fn(),
            removeException: jest.fn(),
            addUseCase: jest.fn(),
            addSecondaryUseCase: jest.fn(),
            checkRelationships: jest.fn(),
            setRelatedFlag: jest.fn(),
          },
        },
        {
          provide: ExceptionalRequirementRepository,
          useValue: {
            getById: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: PrimaryUseCaseRepository,
          useValue: {
            getById: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: UseCaseService,
          useValue: {
            findById: jest.fn(),
            delete: jest.fn(),
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

    service = module.get<RequirementService>(RequirementService);
    requirementRepo = module.get(RequirementRepository);
    exceptionRepo = module.get(ExceptionalRequirementRepository);
    useCaseService = module.get(UseCaseService);
    actorService = module.get(ActorService);
  });

  describe("createRequirement", () => {
    it("should create a requirement successfully", async () => {
      const dto = { operation: "Register", useCaseId: "1", actorIds: ["A1"] };

      useCaseService.findById.mockResolvedValue({ id: "1", name: "Auth Use Case" } as any);
      actorService.findById.mockResolvedValue({ id: "A1", name: "User" } as any);
      requirementRepo.create.mockResolvedValue(mockRequirement);

      const result = await service.createRequirement(dto);
      expect(result).toEqual(mockRequirement);
      expect(requirementRepo.create).toHaveBeenCalledWith(dto);
    });

    it("should throw BadRequestException if use case not found", async () => {
      const dto = { operation: "Register", useCaseId: "99" };
      useCaseService.findById.mockRejectedValue(new NotFoundException());

      await expect(service.createRequirement(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe("updateRequirement", () => {
    it("should update an existing requirement", async () => {
      const dto = { operation: "Update Profile", actorIds: ["A1"] };

      requirementRepo.getById.mockResolvedValue(mockRequirement as any);
      actorService.findById.mockResolvedValue({ id: "A1" } as any);
      requirementRepo.update.mockResolvedValue({ ...mockRequirement, ...dto });

      const result = await service.updateRequirement("1", dto);
      expect(result.operation).toBe("Update Profile");
    });

    it("should throw NotFoundException if requirement not found", async () => {
      requirementRepo.getById.mockResolvedValue(null);
      await expect(service.updateRequirement("999", {})).rejects.toThrow(NotFoundException);
    });
  });

  describe("removeRequirement", () => {
    it("should delete requirement and its nested ones", async () => {
      const requirement = {
        ...mockRequirement,
        nestedRequirements: [{ id: "2", operation: "Sub Req", createdAt: "2025-10-08" }],
        exceptions: [{ id: "3", name: "Error Case", createdAt: "2025-10-08" }],
      };

      requirementRepo.getById.mockResolvedValue(requirement as any);

      await service.removeRequirement("1");

      expect(requirementRepo.delete).toHaveBeenCalledWith("2");
      expect(requirementRepo.delete).toHaveBeenCalledWith("1");
    });

    it("should throw NotFoundException if requirement not found", async () => {
      requirementRepo.getById.mockResolvedValue(null);
      await expect(service.removeRequirement("1")).rejects.toThrow(NotFoundException);
    });
  });

  describe("findById", () => {
    it("should return a requirement", async () => {
      requirementRepo.getById.mockResolvedValue(mockRequirement as any);
      const result = await service.findById("1");
      expect(result).toEqual(mockRequirement);
    });

    it("should throw NotFoundException if not found", async () => {
      requirementRepo.getById.mockResolvedValue(null);
      await expect(service.findById("1")).rejects.toThrow(NotFoundException);
    });
  });

  describe("findByUseCase", () => {
    it("should return hydrated requirements", async () => {
      requirementRepo.getByUseCase.mockResolvedValue([mockRequirement as any]);
      requirementRepo.getById.mockResolvedValue(mockRequirement as any);
      exceptionRepo.getById.mockResolvedValue({
        id: "5",
        name: "Failure Case",
        requirements: [],
      } as any);

      const result = await service.findByUseCase("1");
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("relationship management", () => {
    it("should add nested requirement", async () => {
      requirementRepo.getById.mockResolvedValue(mockRequirement as any);
      await service.addNestedRequirement("1", "2");
      expect(requirementRepo.addNestedRequirement).toHaveBeenCalledWith("1", "2");
    });

    it("should remove nested requirement", async () => {
      requirementRepo.getById.mockResolvedValue(mockRequirement as any);
      await service.removeNestedRequirement("1", "2");
      expect(requirementRepo.removeNestedRequirement).toHaveBeenCalledWith("1", "2");
    });

    it("should add exception", async () => {
      requirementRepo.getById.mockResolvedValue(mockRequirement as any);
      exceptionRepo.getById.mockResolvedValue({ id: "5", name: "Invalid Input" } as any);
      await service.addException("1", "5");
      expect(requirementRepo.addException).toHaveBeenCalledWith("1", "5");
    });

    it("should remove exception", async () => {
      requirementRepo.getById.mockResolvedValue(mockRequirement as any);
      exceptionRepo.getById.mockResolvedValue({ id: "5" } as any);
      await service.removeException("1", "5");
      expect(requirementRepo.removeException).toHaveBeenCalledWith("1", "5");
    });

    it("should add secondary use case to nested requirements", async () => {
      const parent = { ...mockRequirement, nestedRequirements: [{ id: "2" }] };
      requirementRepo.getById.mockResolvedValue(parent as any);
      useCaseService.findById.mockResolvedValue({ id: "99", name: "Sub Flow" } as any);

      await service.setParentRequirementToSecondaryUseCase("1", "99");

      expect(requirementRepo.addSecondaryUseCase).toHaveBeenCalledWith("1", "99");
      expect(requirementRepo.addUseCase).toHaveBeenCalledWith("2", "99");
    });
  });

  describe("checkRequirementRelationships", () => {
    it("should return relationship flags", async () => {
      requirementRepo.getById.mockResolvedValue(mockRequirement as any);

      requirementRepo.checkRelationships.mockResolvedValue({
        hasCondition: true,
        hasActivity: false,
      });

      const result = await service.checkRequirementRelationships("1");

      expect(result).toEqual({ hasCondition: true, hasActivity: false });
    });
  });
});

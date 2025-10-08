import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { UseCaseService } from "src/features/use-case/services/use-case/use-case.service";
import { RequirementException } from "../entities/requirement-exception.entity";
import { RequirementAttributes, RequirementRelationships } from "../models/requirement.model";
import { ExceptionalRequirementRepository } from "../repositories/exceptional-requirement.repository";
import { RequirementRepository } from "../repositories/requirement.repository";
import { RequirementExceptionService } from "./requirement-exception.service";
import { RequirementService } from "./requirement.service";

describe("RequirementExceptionService", () => {
  let service: RequirementExceptionService;
  let exceptionRepo: jest.Mocked<ExceptionalRequirementRepository>;
  let requirementService: jest.Mocked<RequirementService>;
  let useCaseService: jest.Mocked<UseCaseService>;
  let requirementRepo: jest.Mocked<RequirementRepository>;

  const mockRequirement: RequirementAttributes & Partial<RequirementRelationships> = {
    id: "1",
    operation: "Login",
    condition: "Valid credentials",
    createdAt: "2025-10-08T12:00:00Z",
    updatedAt: "2025-10-08T12:00:00Z",
    nestedRequirements: [],
    exceptions: [],
  };

  const mockException: RequirementException = {
    id: "1",
    name: "Invalid Login Attempt",
    requirements: [{ id: "r1", name: "Login validation" }],
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequirementExceptionService,
        {
          provide: ExceptionalRequirementRepository,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            getById: jest.fn(),
            getByUseCase: jest.fn(),
            delete: jest.fn(),
            addRequirement: jest.fn(),
            addSecondaryUseCase: jest.fn(),
          },
        },
        {
          provide: RequirementService,
          useValue: {
            findById: jest.fn(),
            addException: jest.fn(),
            removeRequirement: jest.fn(),
          },
        },
        {
          provide: RequirementRepository,
          useValue: {
            addUseCase: jest.fn(),
          },
        },
        {
          provide: UseCaseService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RequirementExceptionService>(RequirementExceptionService);
    exceptionRepo = module.get(ExceptionalRequirementRepository);
    requirementService = module.get(RequirementService);
    useCaseService = module.get(UseCaseService);
    requirementRepo = module.get(RequirementRepository);
  });

  describe("create()", () => {
    it("should create and link an exception successfully", async () => {
      const dto = { name: "Error Case", requirementId: "r1" };
      requirementService.findById.mockResolvedValue({ id: "r1" } as any);
      exceptionRepo.create.mockResolvedValue(mockException);
      requirementService.addException.mockResolvedValue(mockRequirement);

      const result = await service.create(dto);

      expect(result).toEqual(mockException);
      expect(requirementService.findById).toHaveBeenCalledWith("r1");
      expect(exceptionRepo.create).toHaveBeenCalledWith(dto);
      expect(requirementService.addException).toHaveBeenCalledWith("r1", mockException.id);
    });

    it("should throw BadRequestException if requirement not found", async () => {
      const dto = { name: "Error Case", requirementId: "r99" };
      requirementService.findById.mockRejectedValue(new NotFoundException());

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe("update()", () => {
    it("should update an existing exception", async () => {
      exceptionRepo.getById.mockResolvedValue(mockException);
      exceptionRepo.update.mockResolvedValue({ ...mockException, name: "Updated Exception" });

      const result = await service.update("1", { name: "Updated Exception" });
      expect(result.name).toBe("Updated Exception");
      expect(exceptionRepo.update).toHaveBeenCalledWith("1", "Updated Exception");
    });

    it("should throw NotFoundException if exception not found", async () => {
      exceptionRepo.getById.mockResolvedValue(null);
      await expect(service.update("x", { name: "Nope" })).rejects.toThrow(NotFoundException);
    });
  });

  describe("findById()", () => {
    it("should return exception by ID", async () => {
      exceptionRepo.getById.mockResolvedValue(mockException);
      const result = await service.findById("1");
      expect(result).toEqual(mockException);
    });

    it("should throw NotFoundException if not found", async () => {
      exceptionRepo.getById.mockResolvedValue(null);
      await expect(service.findById("99")).rejects.toThrow(NotFoundException);
    });
  });

  describe("getByUseCase()", () => {
    it("should return exceptions for a valid use case", async () => {
      exceptionRepo.getByUseCase.mockResolvedValue([mockException]);
      const result = await service.getByUseCase("usecase-1");
      expect(result.length).toBe(1);
    });

    it("should throw BadRequestException if useCaseId is empty", async () => {
      await expect(service.getByUseCase("")).rejects.toThrow(BadRequestException);
    });

    it("should throw generic Error if repo fails", async () => {
      exceptionRepo.getByUseCase.mockRejectedValue(new Error("DB error"));
      await expect(service.getByUseCase("usecase-1")).rejects.toThrow(Error);
    });
  });

  describe("addRequirement()", () => {
    it("should link a requirement to an exception", async () => {
      exceptionRepo.getById.mockResolvedValue(mockException);
      requirementService.findById.mockResolvedValue({ id: "r1" } as any);
      exceptionRepo.addRequirement.mockResolvedValue(mockException);

      const result = await service.addRequirement("1", "r1");
      expect(result).toEqual(mockException);
      expect(exceptionRepo.addRequirement).toHaveBeenCalledWith("1", "r1");
    });
  });

  describe("remove()", () => {
    it("should delete an exception and its requirements", async () => {
      exceptionRepo.getById.mockResolvedValue(mockException);
      exceptionRepo.delete.mockResolvedValue(true);
      requirementService.removeRequirement.mockResolvedValue(true);

      const result = await service.remove("1");
      expect(result).toBe(true);
      expect(requirementService.removeRequirement).toHaveBeenCalledWith("r1");
      expect(exceptionRepo.delete).toHaveBeenCalledWith("1");
    });

    it("should throw NotFoundException if exception not found", async () => {
      exceptionRepo.getById.mockResolvedValue(null);
      await expect(service.remove("1")).rejects.toThrow(NotFoundException);
    });
  });

  describe("setExceptionToSecondaryUseCase()", () => {
    it("should transfer requirements to another use case", async () => {
      exceptionRepo.getById.mockResolvedValue(mockException);
      useCaseService.findById.mockResolvedValue({ id: "uc1", name: "Secondary" } as any);
      exceptionRepo.addSecondaryUseCase.mockResolvedValue(mockException);
      requirementRepo.addUseCase.mockResolvedValue(true);

      const result = await service.setExceptionToSecondaryUseCase("1", "uc1");
      expect(result).toBe(true);
      expect(exceptionRepo.addSecondaryUseCase).toHaveBeenCalledWith("1", "uc1");
      expect(requirementRepo.addUseCase).toHaveBeenCalledWith("r1", "uc1");
    });

    it("should throw BadRequestException if no requirements found", async () => {
      const exceptionWithoutReq = { id: "1", requirements: [] };
      exceptionRepo.getById.mockResolvedValue(exceptionWithoutReq as any);
      useCaseService.findById.mockResolvedValue({ id: "uc1" } as any);

      await expect(service.setExceptionToSecondaryUseCase("1", "uc1")).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});

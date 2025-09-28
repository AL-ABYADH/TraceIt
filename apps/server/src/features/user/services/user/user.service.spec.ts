import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { UserRepository } from "../../repositories/user/user.repository";
import { ConflictException, NotFoundException } from "@nestjs/common";

describe("UserService", () => {
  let service: UserService;
  let repository: jest.Mocked<UserRepository>;

  const mockUser = {
    id: "1",
    username: "john_doe",
    displayName: "John Doe",
    email: "john@example.com",
    password: "hashedpassword",
    emailVerified: false,
    createdAt: new Date().toISOString(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            getById: jest.fn(),
            getByEmail: jest.fn(),
            getByUsername: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            updatePassword: jest.fn(),
            setEmailVerified: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get(UserRepository);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  // =====================
  // REGISTER
  // =====================
  describe("register", () => {
    it("should create a new user successfully", async () => {
      repository.getByEmail.mockResolvedValue(null);
      repository.getByUsername.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockUser);

      const result = await service.register({
        username: "john_doe",
        displayName: "John Doe",
        email: "john@example.com",
        password: "secret",
      });

      expect(result).toEqual(mockUser);
      expect(repository.create).toHaveBeenCalledWith({
        username: "john_doe",
        displayName: "John Doe",
        email: "john@example.com",
        password: "secret",
      });
    });

    it("should throw ConflictException if email exists", async () => {
      repository.getByEmail.mockResolvedValue(mockUser);

      await expect(
        service.register({
          username: "john_doe",
          displayName: "John Doe",
          email: "john@example.com",
          password: "secret",
        }),
      ).rejects.toThrow(ConflictException);
    });

    it("should throw ConflictException if username exists", async () => {
      repository.getByEmail.mockResolvedValue(null);
      repository.getByUsername.mockResolvedValue(mockUser);

      await expect(
        service.register({
          username: "john_doe",
          displayName: "John Doe",
          email: "john@example.com",
          password: "secret",
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  // =====================
  // FIND BY ID
  // =====================
  describe("findById", () => {
    it("should return user if found", async () => {
      repository.getById.mockResolvedValue(mockUser);
      const user = await service.findById("1");
      expect(user).toEqual(mockUser);
    });

    it("should throw NotFoundException if user not found", async () => {
      repository.getById.mockResolvedValue(null);
      await expect(service.findById("1")).rejects.toThrow(NotFoundException);
    });
  });

  // =====================
  // UPDATE PROFILE
  // =====================
  describe("updateProfile", () => {
    it("should update successfully", async () => {
      repository.getById.mockResolvedValue(mockUser);
      repository.getByUsername.mockResolvedValue(null);
      repository.update.mockResolvedValue({ ...mockUser, username: "new_name" });

      const result = await service.updateProfile("1", { username: "new_name" });

      expect(result.username).toBe("new_name");
    });

    it("should throw ConflictException if username is taken", async () => {
      repository.getById.mockResolvedValue(mockUser);
      repository.getByUsername.mockResolvedValue({ ...mockUser, id: "2" });

      await expect(service.updateProfile("1", { username: "john_doe" })).rejects.toThrow(
        ConflictException,
      );
    });
  });

  // =====================
  // RESET PASSWORD
  // =====================
  describe("resetPassword", () => {
    it("should reset password successfully", async () => {
      repository.getById.mockResolvedValue(mockUser);
      repository.updatePassword.mockResolvedValue({ ...mockUser, password: "newpass" });

      const result = await service.resetPassword("1", "newpass");
      expect(result.password).toBe("newpass");
    });

    it("should throw NotFoundException if user not found", async () => {
      repository.getById.mockResolvedValue(null);
      await expect(service.resetPassword("1", "newpass")).rejects.toThrow(NotFoundException);
    });
  });

  // =====================
  // VERIFY EMAIL
  // =====================
  describe("verifyEmail", () => {
    it("should verify email successfully", async () => {
      repository.getById.mockResolvedValue(mockUser);
      repository.setEmailVerified.mockResolvedValue({ ...mockUser, emailVerified: true });

      const result = await service.verifyEmail("1");
      expect(result.emailVerified).toBe(true);
    });
  });
});

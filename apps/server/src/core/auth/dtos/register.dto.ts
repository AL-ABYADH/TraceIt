import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsStrongPassword,
} from "class-validator";
import { RegisterInterface } from "../interfaces/register.interface";

/**
 * Data Transfer Object for user registration
 * Contains all required fields to create a new user account
 */
export class RegisterDto implements RegisterInterface {
  @IsNotEmpty({ message: "The name is required" })
  @IsString({ message: "The name must be a string" })
  @MaxLength(50, { message: "The name cannot exceed 50 characters" })
  displayName: string;

  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Please enter a valid email address" })
  email: string;

  @IsNotEmpty({ message: "Username is required" })
  @IsString({ message: "Username must be a string" })
  @MinLength(3, { message: "Username must be at least 3 characters long" })
  @MaxLength(20, { message: "Username cannot exceed 20 characters" })
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: "Username can only contain letters, numbers, underscores and hyphens",
  })
  username: string;

  @IsNotEmpty({ message: "Password is required" })
  @IsString({ message: "Password must be a string" })
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    },
  )
  password: string;
}

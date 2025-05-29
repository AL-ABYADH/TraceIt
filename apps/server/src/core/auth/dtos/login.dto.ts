import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { AtLeastOneOf } from "../../helper/custom-validators";

/**
 * Data Transfer Object for user login
 * Accepts either email or username with password
 */

@AtLeastOneOf(["email", "username"])
export class LoginDto {
  @IsOptional()
  @IsEmail({}, { message: "Please enter a valid email address" })
  email?: string;

  @IsOptional()
  @IsString({ message: "Username must be a string" })
  username?: string;

  @IsNotEmpty({ message: "Password is required" })
  @IsString({ message: "Password must be a string" })
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  password: string;
}

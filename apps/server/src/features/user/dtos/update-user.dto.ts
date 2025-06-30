import { UpdateUserInterface } from "../interfaces/update-user.interface";
import { AtLeastOneOf } from "@repo/custom-validators";
import { IsOptional } from "class-validator";

@AtLeastOneOf(["username", "displayName"])
export class UpdateUserDto implements UpdateUserInterface {
  @IsOptional()
  username?: string;
  @IsOptional()
  displayName?: string;
}

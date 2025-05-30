import { UpdateUserInterface } from "../interfaces/update-user.interface";
import { AtLeastOneOf } from "@repo/custom-validators";

@AtLeastOneOf(["username", "displayName"])
export class UpdateUserDto implements UpdateUserInterface {
  username?: string;
  displayName?: string;
}

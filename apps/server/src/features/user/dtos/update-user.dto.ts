import { UpdateUserInterface } from "../interfaces/update-user.interface";

export class UpdateUserDto implements UpdateUserInterface {
  username?: string;
  displayName?: string;
}

import { CreateUserInterface } from "../interfaces/create-user.interface";

export class CreateUserDto implements CreateUserInterface {
  username: string;
  displayName: string;
  email: string;
  password: string;
}

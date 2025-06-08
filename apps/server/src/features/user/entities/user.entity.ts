import { Exclude } from "class-transformer";

export class User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;

  authProvider: string;

  isTwoFactorEnabled: boolean;

  twoFactorToken: string;

  @Exclude({ toPlainOnly: true })
  password: string;
}

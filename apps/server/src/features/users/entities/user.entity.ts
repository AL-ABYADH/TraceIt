/**
 * User entity for storing user account information
 */
export class User {
  id: string;
  fullName: string;
  email: string;
  username: string;
  password: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

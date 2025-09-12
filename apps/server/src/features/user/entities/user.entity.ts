import { UserAttributes, UserRelationships } from "../models/user.model";

export type User = UserAttributes & Partial<UserRelationships>;

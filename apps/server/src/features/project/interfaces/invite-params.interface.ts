export interface InviteParamsInterface {
  userId: string;
  email: string | null;
  username: string | null;
  projectId: string;
  projectRoleIds: string[];
}

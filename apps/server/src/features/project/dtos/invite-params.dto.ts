import { InviteParamsInterface } from "../interfaces/invite-params.interface";

export class InviteParamsDto implements InviteParamsInterface {
  userId: string;
  email: string | null;
  username: string | null;
  projectId: string;
  projectRoleIds: string[];
}

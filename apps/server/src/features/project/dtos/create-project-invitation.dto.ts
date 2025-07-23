import { CreateProjectInvitationInterface } from "../interfaces/create-project-invitation.interface";

export class CreateProjectInvitationDto implements CreateProjectInvitationInterface {
  senderId: string;
  receiverId: string;
  projectId: string;
  projectRoleIds: string[];
  expirationDate: Date;
}

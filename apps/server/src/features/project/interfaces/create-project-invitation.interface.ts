export interface CreateProjectInvitationInterface {
  senderId: string;
  receiverId: string;
  projectId: string;
  projectRoleIds: string[];
  expirationDate: Date;
}

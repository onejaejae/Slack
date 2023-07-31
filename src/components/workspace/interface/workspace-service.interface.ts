import { User } from 'src/components/user/schema/user.schema';
import { Workspace } from '../schema/workspace.schema';
import { CreateWorkspaceDto } from '../dto/create-workspace.dto';
import { CreateWorkspaceMemberDto } from '../dto/create-workspace.member.dto';

export const WorkspaceServiceKey = 'WorkspaceServiceKey';

export interface IWorkspaceService {
  getMyWorkspaces(userId: number): Promise<Workspace[]>;
  getWorkspaceMember(url: string, userId: number): Promise<User>;

  getWorkspaceMembers(url: string): Promise<User[]>;

  createWorkspace(
    createWorkspaceDto: CreateWorkspaceDto,
    userId: number,
  ): Promise<void>;

  createWorkspaceMembers(
    url: string,
    createWorkspaceMemberDto: CreateWorkspaceMemberDto,
  ): Promise<void>;
}

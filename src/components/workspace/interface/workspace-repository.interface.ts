import { IBaseRepository } from 'src/database/interface/base-repository.interface';
import {
  Workspace,
  workspaceJoinWithChannel,
} from '../schema/workspace.schema';

export const WorkspaceRepositoryKey = 'WorkspaceRepositoryKey';

export interface IWorkspaceRepository extends IBaseRepository<Workspace> {
  findMyWorkspaces(userId: number): Promise<Workspace[]>;

  joinChannel(url: string): Promise<workspaceJoinWithChannel>;
}

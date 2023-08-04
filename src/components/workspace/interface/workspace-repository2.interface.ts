import { IBaseRepository } from 'src/database/interface/base-repository.interface';
import {
  Workspace,
  workspaceJoinWithChannel,
} from '../schema/workspace.schema';

export const WorkspaceRepositoryKey2 = 'WorkspaceRepositoryKey2';

export interface IWorkspaceRepository2 extends IBaseRepository<Workspace> {
  findMyWorkspaces(userId: number): Promise<Workspace[]>;

  joinChannel(url: string): Promise<workspaceJoinWithChannel>;
}

import { IBaseRepository } from 'src/database/interface/base-repository.interface';
import { WorkspaceMember } from '../schema/workspace.member.schema';

export const WorkspaceMemberRepositoryKey = 'WorkspaceMemberRepositoryKey';

export interface IWorkspaceMemberRepository
  extends IBaseRepository<WorkspaceMember> {}

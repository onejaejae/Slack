import { Injectable } from '@nestjs/common';
import { WorkspaceMember } from 'src/components/workspace/schema/workspace.member.schema';
import { SlackBaseRepository } from 'src/database/base.repository';
import { TransactionManager } from 'src/database/transaction.manager';
import { EntityTarget } from 'typeorm';
import { IWorkspaceMemberRepository } from '../interface/workspace-member-repository.interface';

@Injectable()
export class WorkspaceMemberRepository
  extends SlackBaseRepository<WorkspaceMember>
  implements IWorkspaceMemberRepository
{
  getName(): EntityTarget<WorkspaceMember> {
    return WorkspaceMember.name;
  }

  constructor(protected readonly txManager: TransactionManager) {
    super(WorkspaceMember);
  }
}

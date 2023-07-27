import { Injectable } from '@nestjs/common';
import { SlackBaseRepository } from 'src/database/base.repository';
import { EntityTarget } from 'typeorm';
import { Workspace } from '../schema/workspace.schema';
import { TransactionManager } from 'src/database/transaction.manager';
import { TransformPlainToInstance } from 'class-transformer';

@Injectable()
export class WorkspaceRepository extends SlackBaseRepository<Workspace> {
  getName(): EntityTarget<Workspace> {
    return Workspace.name;
  }

  constructor(protected readonly txManager: TransactionManager) {
    super(Workspace);
  }

  @TransformPlainToInstance(Workspace)
  async findMyWorkspaces(userId: number): Promise<Workspace[]> {
    return this.getRepository().find({
      where: {
        WorkspaceMembers: [{ userId }],
      },
    });
  }
}

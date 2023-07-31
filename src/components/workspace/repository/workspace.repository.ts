import { Injectable } from '@nestjs/common';
import { SlackBaseRepository } from 'src/database/base.repository';
import { EntityTarget } from 'typeorm';
import {
  Workspace,
  workspaceJoinWithChannel,
} from '../schema/workspace.schema';
import { TransactionManager } from 'src/database/transaction.manager';
import { TransformPlainToInstance } from 'class-transformer';
import { IWorkspaceRepository } from '../interface/workspace-repository.interface';

@Injectable()
export class WorkspaceRepository
  extends SlackBaseRepository<Workspace>
  implements IWorkspaceRepository
{
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

  @TransformPlainToInstance(workspaceJoinWithChannel)
  async joinChannel(url: string): Promise<workspaceJoinWithChannel> {
    return this.getRepository().findOne({
      where: {
        url,
      },
      relations: ['Channels'],
    });
  }
}

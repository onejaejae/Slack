import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityTarget } from 'typeorm';
import { User, UserJoinWithWorkspace } from '../schema/user.schema';
import { SlackBaseRepository } from 'src/database/base.repository';
import { TransactionManager } from 'src/database/transaction.manager';
import { TransformPlainToInstance } from 'class-transformer';
import { IUserRepository } from '../interface/user-repository.interface';

@Injectable()
export class UserRepository
  extends SlackBaseRepository<User>
  implements IUserRepository
{
  getName(): EntityTarget<User> {
    return User.name;
  }

  constructor(protected readonly txManager: TransactionManager) {
    super(User);
  }

  @TransformPlainToInstance(User)
  async findByEmail(email: string): Promise<User> {
    return this.getQueryBuilder()
      .select(['user.password', 'user.email', 'user.nickname', 'user.id'])
      .where('user.email=:email', {
        email,
      })
      .getOne();
  }

  @TransformPlainToInstance(User)
  async getWorkspaceMember(url: string, userId: number): Promise<User> {
    return this.getQueryBuilder()
      .where('user.id=:userId', { userId })
      .innerJoin('user.Workspaces', 'workspace', 'workspace.url =:url', {
        url,
      })
      .getOne();
  }

  @TransformPlainToInstance(User)
  async getWorkspaceMembers(url: string): Promise<User[]> {
    return this.getQueryBuilder()
      .innerJoin('user.WorkspaceMembers', 'members')
      .innerJoin('members.Workspace', 'workspace', 'workspace.url =:url', {
        url,
      })
      .getMany();
  }

  @TransformPlainToInstance(UserJoinWithWorkspace)
  async joinWithWorkspace(email: string): Promise<UserJoinWithWorkspace> {
    const res = (await this.getQueryBuilder()
      .leftJoinAndSelect('user.Workspaces', 'workspace')
      .where('user.email=:email', { email })
      .getOne()) as any;

    if (!res) throw new BadRequestException(`email: ${email} don't exist`);
    return res;
  }

  async getWorkspaceChannelMembers(url: string, name: string): Promise<User[]> {
    return this.getQueryBuilder()
      .innerJoin('user.Channels', 'channels', 'channels.name = :name', { name })
      .innerJoin('user.Workspaces', 'workspaces', 'workspaces.url = :url', {
        url,
      })
      .getMany();
  }
}

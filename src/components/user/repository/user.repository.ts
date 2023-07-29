import { Injectable } from '@nestjs/common';
import { EntityTarget } from 'typeorm';
import { User } from '../schema/user.schema';
import { SlackBaseRepository } from 'src/database/base.repository';
import { TransactionManager } from 'src/database/transaction.manager';
import { TransformPlainToInstance } from 'class-transformer';

@Injectable()
export class UserRepository extends SlackBaseRepository<User> {
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
  async getWorkspaceMembers(url: string): Promise<User[]> {
    return this.getQueryBuilder()
      .innerJoin('user.WorkspaceMembers', 'members')
      .innerJoin('members.Workspace', 'workspace', 'workspace.url =:url', {
        url,
      })
      .getMany();
  }
}

import { Injectable } from '@nestjs/common';
import {
  DataSource,
  EntityTarget,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { User } from '../schema/user.schema';
import { SlackBaseRepository } from 'src/database/base.repository';

@Injectable()
export class UserRepository extends SlackBaseRepository<User> {
  getName(): EntityTarget<User> {
    return User.name;
  }

  async findByEmail(email: string): Promise<User> {
    return this.getQueryRepository()
      .select(['user.password', 'user.email', 'user.nickname', 'user.id'])
      .where('user.email=:email', {
        email,
      })
      .getOne();
  }
}

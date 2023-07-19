import { Injectable } from '@nestjs/common';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { User } from '../schema/user.schema';

@Injectable()
export class UserRepository extends Repository<User> {
  private userRepository: SelectQueryBuilder<User>;
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
    this.userRepository = this.dataSource
      .getRepository(User)
      .createQueryBuilder('user');
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository
      .select(['user.password', 'user.email', 'user.nickname', 'user.id'])
      .where('user.email=:email', {
        email,
      })
      .getOne();
  }
}

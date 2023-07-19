import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '../user/schema/user.schema';
import { UserRepository } from '../user/repository/user.repository';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(
    @Inject(UserRepository) private readonly usersRepository: UserRepository,
  ) {
    super();
  }

  serializeUser(user: User, done: CallableFunction) {
    done(null, user.id);
  }

  async deserializeUser(userId: string, done: CallableFunction) {
    return await this.usersRepository
      .findOneOrFail({
        where: { id: +userId },
        select: ['id', 'email', 'nickname'],
        relations: ['Workspaces'],
      })
      .then((user) => {
        done(null, user);
      })
      .catch((error) => done(error));
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '../user/schema/user.schema';
import { UserRepository } from '../user/repository/user.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {
    super();
  }

  serializeUser(user: User, done: CallableFunction) {
    done(null, user.id);
  }

  async deserializeUser(userId: number, done: CallableFunction) {
    return await this.userRepository
      .findByIdOrThrow(userId)
      .then((user) => {
        done(null, user);
      })
      .catch((error) => done(error));
  }
}

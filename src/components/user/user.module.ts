import { ClassProvider, Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './user.controller';
import { UserRepository } from './repository/user.repository';
import { UserServiceKey } from './interface/user-service.interface';
import { UserRepositoryKey } from './interface/user-repository.interface';

const userService: ClassProvider = {
  provide: UserServiceKey,
  useClass: UserService,
};

const userRepository: ClassProvider = {
  provide: UserRepositoryKey,
  useClass: UserRepository,
};
@Module({
  controllers: [UserController],
  providers: [userService, userRepository],
  exports: [userRepository],
})
export class UserModule {}

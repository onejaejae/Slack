import { ClassProvider, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './repository/user.repository';
import { UserServiceKey } from './interface/user-service.interface';

const userService: ClassProvider = {
  provide: UserServiceKey,
  useClass: UserService,
};
@Module({
  controllers: [UserController],
  providers: [userService, UserRepository],
  exports: [UserRepository],
})
export class UserModule {}

import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { UserService } from './service/user.service';
import { Credentials } from 'src/common/decorators/credential.decorator';
import { VerifiedUser } from 'src/types/user/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import {
  IUserService,
  UserServiceKey,
} from './interface/user-service.interface';

@Controller('users')
export class UserController {
  constructor(
    @Inject(UserServiceKey) private readonly userService: IUserService,
  ) {}

  // '내 정보 가져오기'
  @UseGuards(AuthGuard)
  @Get()
  async getProfile(@Credentials() credentials: VerifiedUser) {
    return this.userService.getProfile(credentials.user.email);
  }
}

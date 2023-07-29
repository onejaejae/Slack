import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Credentials } from 'src/common/decorators/credential.decorator';
import { VerifiedUser } from 'src/types/user/common';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // '내 정보 가져오기'
  // @UseGuards(AuthGuard)
  @Get()
  async getProfile(@Credentials() credentials: VerifiedUser) {
    // return credentials.user || false;
    return false;
  }
}

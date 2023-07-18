import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { JoinDto } from './dto/join.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getProfile() {
    return this.userService.getProfile();
  }

  @Post('login')
  async login() {
    return this.userService.login();
  }

  @Post('/join')
  async join(@Body() joinDto: JoinDto) {
    return this.userService.join(joinDto);
  }

  @Post('logout')
  async logout() {
    this.userService.logout();
  }
}

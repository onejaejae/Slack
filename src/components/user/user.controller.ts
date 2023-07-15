import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { JoinDto } from './dto/join.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getProfile() {}

  @Post('login')
  async login() {}

  @Post()
  async join(@Body() joinDto: JoinDto) {}

  @Post('logout')
  async logout() {}
}

import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JoinDto } from './dto/join.dto';
import { User } from 'src/common/decorators/user.decorator';
import { UserJoinWithWorkspace } from 'src/types/user/common';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { LoggedInGuard } from '../auth/guards/logged-in.guard';
import { NotLoggedInGuard } from '../auth/guards/not-logged-in.guard';
import { Response } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getProfile(@User() user: UserJoinWithWorkspace) {
    return user || false;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@User() user: UserJoinWithWorkspace) {
    return user;
  }

  @UseGuards(new NotLoggedInGuard())
  @Post('/join')
  async join(@Body() joinDto: JoinDto) {
    return this.userService.join(joinDto);
  }

  @UseGuards(new LoggedInGuard())
  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('connect.sid', { httpOnly: true });
    return res.send('ok');
  }
}

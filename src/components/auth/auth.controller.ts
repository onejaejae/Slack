import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { SignInDto } from './dto/signIn.dto';
import { JoinDto } from './dto/join.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/join')
  async join(@Body() joinDto: JoinDto) {
    return this.authService.join(joinDto);
  }

  @Post('login')
  async login(@Req() req: Request, @Body() signInDto: SignInDto) {
    const result = await this.authService.login(signInDto);

    req.session.credentials = { user: result };
    req.session.save();

    return result;
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    console.log('req.session', req.session);

    // res.clearCookie('connect.sid', { httpOnly: true });
    return res.send('ok');
  }
}

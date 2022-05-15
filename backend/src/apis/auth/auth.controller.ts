import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import bcrypt from 'bcrypt';

export interface IOAuthUser {
  user: Pick<User, 'email'>;
}

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  @Post('/login')
  async login(@Body('email') email: string, @Body('password') password: string, @Res() res: Response) {
    const user = await this.userService.findOne({ email });
    if (!user) throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지않습니다.');
    const isAuthenticated = await bcrypt.compare(password, user.password);
    if (!isAuthenticated) throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지않습니다.');

    this.authService.setRefreshToken({ user, res });
    const accessToken = this.authService.getAccessToken({ user });
    res.send({ accessToken });
  }

  @Get('/login/google')
  @UseGuards(AuthGuard('google'))
  async loginGoogle(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    await this.authService.OAuthLogin(req, res);
  }

  @Post('/restore/accessToken')
  @UseGuards(AuthGuard('refresh'))
  restoreAccessToken(@Req() req: Request) {
    return { accessToken: this.authService.getAccessToken({ user: req.user }) };
  }
}

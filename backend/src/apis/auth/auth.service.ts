import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  getAccessToken({ user }) {
    return this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: process.env.ACCESS_TOKEN_KEY, expiresIn: '1h' },
    );
  }

  setRefreshToken({ user, res }) {
    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: process.env.REFRESH_TOKEN_KEY, expiresIn: '2w' },
    );
    res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`);
  }

  // 구글 로그인시 유저정보가 없다면 redis에 이메일저장 및 쿠키에 이메일 저장 후 회원가입페이지로 이동
  async OAuthLogin(req, res) {
    const user = await this.userService.findOne({ email: req.user.email });

    if (!user) {
      const email = await this.cacheManager.get(`email:${req.user.email}`);
      if (!email) await this.cacheManager.set(`email:${req.user.email}`, 'email', { ttl: 60 * 60 });

      res.setHeader('Set-Cookie', `email=${req.user.email}; path=/;`);
      res.redirect('http://localhost:5501/frontend/signupSocial.html');
      return;
    }

    this.setRefreshToken({ user, res });
    res.redirect('http://localhost:5501/frontend/login.html');
  }
}

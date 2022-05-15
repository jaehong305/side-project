import { Controller, Post, Body, Req, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserSocialDto } from './dto/create-user-social.dto';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto copy';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body('createUserDto') createUserDto: CreateUserDto) {
    return await this.userService.create({ createUserDto });
  }

  @Post('/social')
  async createSocial(@Req() req: Request, @Body('createUserSocialDto') createUserSocialDto: CreateUserSocialDto) {
    const email = req.headers.cookie
      .split('; ')
      .filter(e => e.includes('email='))[0]
      .replace('email=', '');
    return await this.userService.createSocial({ email, createUserSocialDto });
  }

  @Patch()
  @UseGuards(AuthGuard('access'))
  async update(@Body('updateUserDto') updateUserDto: UpdateUserDto, @Req() req: Request) {
    return await this.userService.update({ updateUserDto, currentUser: req.user });
  }
}

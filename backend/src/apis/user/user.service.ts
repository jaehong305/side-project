import { CACHE_MANAGER, ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserSocialDto } from './dto/create-user-social.dto';
import { User } from './entities/user.entity';
import { Cache } from 'cache-manager';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

interface ICreateUserSocial {
  email: string;
  createUserSocialDto: CreateUserSocialDto;
}

@Injectable()
export class UserService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne({ email }) {
    const user = await this.userRepository.findOne({
      select: ['email', 'password', 'nickname', 'image', 'createdAt'],
      where: { email },
    });
    return user;
  }

  async create({ createUserDto }) {
    const { password, ...rest } = createUserDto;
    const user = await this.findOne({ email: createUserDto.email });
    if (user) throw new ConflictException('이미 가입된 이메일입니다.');

    const hashPassword = await bcrypt.hash(password, 10);
    return await this.userRepository.save({ ...rest, password: hashPassword });
  }

  async createSocial({ email, createUserSocialDto }: ICreateUserSocial) {
    const authEmail = await this.cacheManager.get(`email:${email}`);
    if (!authEmail) throw new UnauthorizedException('인증되지 않은 이메일입니다.');

    if (await this.findOne({ email })) throw new ConflictException('이미 가입된 이메일입니다.');
    const user = await this.userRepository.save({ email, password: uuidv4(), ...createUserSocialDto });
    await this.cacheManager.del(`email:${email}`);
    return user;
  }

  async update({ updateUserDto, currentUser }) {
    const { password, ...rest } = updateUserDto;
    const user = await this.findOne({ email: currentUser.email });
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = {
      ...user,
      password: hashPassword,
      ...rest,
    };
    return await this.userRepository.save(newUser);
  }
}

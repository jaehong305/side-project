import { PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';

export class CreateUserSocialDto extends PickType(User, ['nickname', 'image']) {}

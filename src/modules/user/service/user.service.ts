import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleRepository } from 'src/modules/role/infrastructure/role.repository';
import { IUser } from '../domain/interfaces/IUser.interface';
import { CreateUserDto, UserResponseDto } from '../dto/user.dto';
import { UserRepository } from '../infrastructure/user.repository';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../domain/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(RoleRepository)
    private readonly roleRepository: RoleRepository
  ) {}

  async registerUser(userInfo: CreateUserDto): Promise<UserResponseDto> {
    const saltOrRounds = 10;
    const userInformation = {
      name: userInfo.name,
      username: userInfo.email,
      email: userInfo.email,
      birthday: null,
      password: await bcrypt.hash(userInfo.password, saltOrRounds),
    };
    const newUser = await this.createUser(userInformation);

    return {
      email: newUser.email,
      name: newUser.name,
      birthday: newUser.birthday,
    };
  }

  async createUser(userInfo: IUser): Promise<UserEntity> {
    const isConflictEmail = await this.userRepository.findOne({
      email: userInfo.email,
    });
    if (isConflictEmail) throw new BadRequestException('Email is already used');

    const roleUser = await this.roleRepository.findOne({ name: 'User' });

    if (!roleUser) throw new InternalServerErrorException('Cant find user id ');

    // mapping
    const newUser: IUser = {
      ...userInfo,
      role: roleUser,
    };
    console.log(newUser);

    const user = await this.userRepository.save(newUser);
    if (!user) throw new ForbiddenException();
    return user;
  }
}

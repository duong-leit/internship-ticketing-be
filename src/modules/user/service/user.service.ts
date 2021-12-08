import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleRepository } from 'src/modules/role/infrastructure/role.repository';
import { IUser } from '../domain/interfaces/IUser.interface';
import {
  CreateFacebookUserDto,
  CreateSystemUserDto,
  UserResponseDto,
} from '../dto/user.dto';
import { UserRepository } from '../infrastructure/user.repository';
import * as bcrypt from 'bcrypt';
import { FacebookAuthService } from 'facebook-auth-nestjs';
import { SALT_OR_ROUNDS } from 'src/common/constant';
import { IFacebookData } from 'src/common/interface/common.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(RoleRepository)
    private readonly roleRepository: RoleRepository,
    private readonly fbService: FacebookAuthService
  ) {}

  async getByEmail(email: string) {
    return this.userRepository.findOne({
      relations: ['role'],
      where: { email: email },
    });
  }

  async getByUsername(username: string) {
    return this.userRepository.findOne({
      relations: ['user'],
      where: { username: username },
    });
  }

  private async saveUser(newData: IUser) {
    if (!newData.email) {
      throw new BadRequestException('Email is required');
    }

    const user = await this.getByEmail(newData.email);
    if (user) {
      throw new BadRequestException('Email is already used');
    }

    newData.roleId = (await this.roleRepository.findOne({ name: 'User' })).id;

    const newUser = await this.userRepository.save(newData);
    return newUser;
  }

  async createSystemUser(
    userInfo: CreateSystemUserDto
  ): Promise<UserResponseDto> {
    const userInformation: IUser = {
      name: userInfo.name,
      username: userInfo.email,
      email: userInfo.email,
      isSocial: false,
      password: await bcrypt.hash(userInfo.password, SALT_OR_ROUNDS),
    };
    await this.saveUser(userInformation);

    return { statusCode: 200 };
  }

  async createFacebookUser(
    userInfo: CreateFacebookUserDto
  ): Promise<UserResponseDto> {
    const userValue: IFacebookData = await this.fbService.getUser(
      userInfo.accessToken,
      'id',
      'name',
      'email',
      'birthday'
    );
    if (!userValue) {
      throw new BadRequestException('The token have been expired');
    }

    if (userInfo.data.email) {
      userValue.email = userInfo.data.email;
    }

    const newUserInfo: IUser = {
      name: userValue.name,
      username: userValue.id,
      email: userValue.email,
      avatar: userInfo.data.avatarUrl || null,
      birthday: userValue.birthday || null,
      isSocial: true,
    };

    await this.saveUser(newUserInfo);
    return { statusCode: 200 };
  }
}

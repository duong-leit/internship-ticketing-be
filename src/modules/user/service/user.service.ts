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
import { UserEntity } from '../domain/entities/user.entity';
import { Like } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(RoleRepository)
    private readonly roleRepository: RoleRepository,
    private readonly fbService: FacebookAuthService
  ) {}

  private static transferEntityToDto(
    users: UserEntity[], ignore:{ [key: string]: boolean }  | undefined = undefined
  ): UserResponseDto[] {
    return users.map((_user) => ({
      id: !ignore['id'] ? _user.id : undefined,
      createdAt: !ignore['createdAt'] ? _user.createdAt : undefined,
      updatedAt: !ignore['name'] ? _user.name : undefined,
      name: !ignore['name'] ? _user.name : undefined,
      email: !!ignore['email'] ? _user.email : undefined,
      username: !ignore['username'] ? _user.username : undefined,
      birthday: !ignore['birthday'] ? _user.birthday : undefined,
      numberPhone: !ignore['phoneNumber'] ? _user.phoneNumber : undefined,
      gender: !ignore['gender'] ? _user.gender : undefined,
      avatarUrl: !ignore['avatarUrl'] ? _user.avatarUrl : undefined,
      isSocial: !ignore['isSocial'] ? _user.isSocial : undefined,
      role: !ignore['role'] ? _user.role?.name : undefined,
      roleId: !ignore['roleId'] ? _user.roleId : undefined
    }));
  }

  async getOneUser(
    data: { [key: string]: string | number } | undefined = undefined,
    relations: { arrayRelation: string[] } | undefined = {
      arrayRelation: ['role'],
    }
  ): Promise<UserEntity | undefined> {
    return await this.userRepository.findOne({
      relations: relations?.arrayRelation || undefined,
      where: {
        ...data,
        isDeleted: false,
      },
    });
  }

  async getListUser(
    data: { [key: string]: string | number } | undefined = undefined,
    relations: { arrayRelation: string[] } | undefined =  {
      arrayRelation: ['role'],
    },
    paging: { pageSize: number | undefined; pageIndex: number | undefined } | undefined = {
      pageSize: 10,
      pageIndex: 1
    }
  ) {
    const dataCheck = {
      [Object.keys(data)[0]]: Like(`%${data[Object.keys(data)[0]]}%`),
    };
    const take = paging.pageSize || 10;
    const skip = paging.pageIndex ? paging.pageIndex - 1 : 0;
    const [result, total] = await this.userRepository.findAndCount({
      relations: relations?.arrayRelation || undefined,
      where: {
        ...dataCheck,
        isDeleted: false,
      },
      // order: { name: 'DESC' },
      take: take,
      skip: skip === 0 ? 0 : skip * take,
    });

    console.log(Object.getOwnPropertyNames(UserResponseDto));
    return {
      statusCode: 200,
      data: UserService.transferEntityToDto(result, {roleId: true}),
      pagination: {
        _totalPage: Math.ceil(total / take),
        _pageSize: take,
        _pageIndex: skip + 1,
      },
    };
  }

  private async saveUser(newData: IUser) {
    const user = await this.getOneUser({ email: newData.email });
    if (user) return { statusCode: 400, message: 'Email is already taken' };

    newData.roleId = (await this.roleRepository.findOne({ name: 'User' })).id;

    const result = await this.userRepository.save(newData);
    if (!result) return { statusCode: 500, message: 'Server Error' };
    return { statusCode: 200, message: 'Create successful' };
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
    return await this.saveUser(userInformation);
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
      avatarUrl: userInfo.data.avatarUrl || null,
      birthday: userValue.birthday || null,
      isSocial: true,
    };

    await this.saveUser(newUserInfo);
    return { statusCode: 200 };
  }
}

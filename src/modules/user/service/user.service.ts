import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleRepository } from 'src/modules/role/infrastructure/role.repository';
import { IUser } from '../domain/interfaces/IUser.interface';
import { CreateSystemUserDto, UserResponseDto } from '../dto/user.dto';
import { UserRepository } from '../infrastructure/user.repository';
import * as bcrypt from 'bcrypt';
import { SALT_OR_ROUNDS } from 'src/common/constant';
import { UserEntity } from '../domain/entities/user.entity';
import { Like } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(RoleRepository)
    private readonly roleRepository: RoleRepository,
    private readonly jwtService: JwtService
  ) {}

  private static transferEntityToDto(
    users: UserEntity[],
    ignore: { [key: string]: boolean } | undefined = undefined
  ) {
    return users.map((_user) => ({
      id: !ignore['id'] ? _user.id : undefined,
      createdAt: !ignore['createdAt'] ? _user.createdAt : undefined,
      updatedAt: !ignore['name'] ? _user.name : undefined,
      name: !ignore['name'] ? _user.name : undefined,
      email: !!ignore['email'] ? _user.email : undefined,
      username: !ignore['username'] ? _user.username : undefined,
      birthday: !ignore['birthday'] ? _user.birthday : undefined,
      numberPhone: !ignore['phoneNumber'] ? _user.phoneNumber : undefined,
      password: !ignore['password'] ? _user.password : undefined,
      gender: !ignore['gender'] ? _user.gender : undefined,
      avatarUrl: !ignore['avatarUrl'] ? _user.avatarUrl : undefined,
      isSocial: !ignore['isSocial'] ? _user.isSocial : undefined,
      role: !ignore['role'] ? _user.role?.name : undefined,
      roleId: !ignore['roleId'] ? _user.roleId : undefined,
    }));
  }

  async getOneUser(
    data: { [key: string]: string | number } | undefined = undefined,
    relations: { arrayRelation: string[] } | undefined = {
      arrayRelation: ['role'],
    }
  ) {
    const user = await this.userRepository.findOne({
      relations: relations?.arrayRelation || undefined,
      where: {
        ...data,
        isDeleted: false,
      },
    });
    if (!user) return { statusCode: 404, message: 'Notfound' };

    return {
      statusCode: 200,
      data: UserService.transferEntityToDto([user], { roleId: true })[0],
    };
  }

  async getListUser(
    data: { [key: string]: string | number } | undefined = undefined,
    relations: { arrayRelation: string[] } | undefined = {
      arrayRelation: ['role'],
    },
    paging: { pageSize?: number; pageIndex: number | undefined } | undefined = {
      pageSize: 10,
      pageIndex: 1,
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

    return {
      statusCode: 200,
      data: UserService.transferEntityToDto(result, {
        roleId: true,
        password: true,
      }),
      pagination: {
        _totalPage: Math.ceil(total / take),
        _pageSize: take,
        _pageIndex: skip + 1,
      },
    };
  }

  private async saveUser(newData: IUser) {
    const result = await this.getOneUser({ email: newData.email });

    if (result.statusCode !== 404)
      return { statusCode: 400, message: 'Email is already taken' };

    newData.roleId = (await this.roleRepository.findOne({ name: 'User' })).id;

    const user = await this.userRepository.save(newData);
    if (!user) return { statusCode: 500, message: 'Server Error' };
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

  async createFacebookUser(createFacebookUserDto, userInfo) {
    if (createFacebookUserDto.email !== userInfo.email)
      return {
        statusCode: 400,
        message: 'Wrong email',
      };

    const newUser: IUser = {
      name: createFacebookUserDto.name,
      username: userInfo.id,
      email: userInfo.email,
      avatarUrl: createFacebookUserDto.avatarUrl || null,
      birthday: userInfo.birthday || null,
      isSocial: true,
    };
    const result = await this.saveUser(newUser);
    if (result.statusCode !== 200) return result;

    return {
      statusCode: 200,
      data: {
        name: newUser.name,
        email: newUser.email,
        avatarUrl: newUser.avatarUrl,
      },
      accessToken: this.generateJWTToken(newUser),
    };
  }
  generateJWTToken(data: any): string {
    const payload = {
      sub: data.id || null,
      email: data.email || null,
      role: data.role?.name || null,
    };
    return this.jwtService.sign(payload);
  }
}

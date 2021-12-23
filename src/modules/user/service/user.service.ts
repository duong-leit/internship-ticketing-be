import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleRepository } from 'src/modules/role/infrastructure/role.repository';
import { IUser } from '../domain/interfaces/IUser.interface';
import {
  CreateSystemUserDto,
  UpdateUserDto,
  UserResponseDto,
} from '../dto/user.dto';
import { UserRepository } from '../infrastructure/user.repository';
import * as bcrypt from 'bcrypt';
import { SALT_OR_ROUNDS } from 'src/common/constant';
import { UserEntity } from '../domain/entities/user.entity';
import { Like } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../../auth/service/auth.service';
import { WalletService } from './wallet.service';
import { ErrorCodeEnum } from 'src/common/enums/errorCode';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(RoleRepository)
    private readonly roleRepository: RoleRepository,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private walletService: WalletService
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
      email: !ignore['email'] ? _user.email : undefined,
      username: !ignore['username'] ? _user.username : undefined,
      birthday: !ignore['birthday'] ? _user.birthday : undefined,
      phoneNumber: !ignore['phoneNumber'] ? _user.phoneNumber : undefined,
      password: !ignore['password'] ? _user.password : undefined,
      gender: !ignore['gender'] ? _user.gender : undefined,
      avatarUrl: !ignore['avatarUrl'] ? _user.avatarUrl : undefined,
      isSocial: !ignore['isSocial'] ? _user.isSocial : undefined,
      role: !ignore['role'] ? _user.role?.name : undefined,
      roleId: !ignore['roleId'] ? _user.roleId : undefined,
    }));
  }

  async getUserInfo(userId: string) {
    const result = await this.getUser({ id: userId });
    if (!result.data) return { statusCode: 404, message: 'Notfound' };
    return {
      statusCode: 200,
      data: result.data,
    };
  }

  async getUser(
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

  async getUsers(
    data: { [key: string]: string | number } | undefined = undefined,
    paging: { pageSize?: number; pageIndex?: number} | undefined
  ) {
    const dataCheck = data ? {
      [Object.keys(data)[0]]: Like(`%${data[Object.keys(data)[0]]}%`),
    } : undefined;

    if(!paging){
      const result = await this.userRepository.find(dataCheck);
      return {
        statusCode: 200,
        data: UserService.transferEntityToDto(result, {
          roleId: true,
          password: true,
        })
      }
    }

    const take = paging.pageSize || 10;
    const skip = paging.pageIndex ? paging.pageIndex*take : 0;
    const [result, total] = await this.userRepository.findAndCount({
      relations: ['role'],
      where: {
        ...dataCheck,
        isDeleted: false,
      },
      take,
      skip
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
        _pageIndex: skip/take,
      },
    };
  }

  private async saveUser(newData: IUser): Promise<UserEntity> {
    const result = await this.getUser({ email: newData.email });

    if (!result)
      //.statusCode !== 404
      throw new BadRequestException('Email is already taken'); //{ statusCode: 400, message: 'Email is already taken' };

    newData.roleId = (await this.roleRepository.findOne({ name: 'User' })).id;

    const user = await this.userRepository.save(newData);
    //if (!user) return { statusCode: 500, message: 'Server Error' };
    return user; //{ statusCode: 200, message: 'Create successful' };
  }

  async createSystemUser(userInfo: CreateSystemUserDto) {
    const userInformation: IUser = {
      name: userInfo.name,
      username: userInfo.email,
      email: userInfo.email,
      isSocial: false,
      password: await bcrypt.hash(userInfo.password, SALT_OR_ROUNDS),
    };
    const newUser = await this.saveUser(userInformation);
    await this.walletService.createWallet(newUser.id);
    return { statusCode: 200, message: 'Create successful' };
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
    await this.walletService.createWallet(newUser.id);
    // if (result.statusCode !== 200) return result;

    return {
      statusCode: 200,
      data: {
        name: newUser.name,
        email: newUser.email,
        avatarUrl: newUser.avatarUrl,
      },
      accessToken: this.authService.generateJWTToken({
        id: result.id,
        email: result.email,
        role: 'User',
      }),
    };
  }

  async update(userDto: UpdateUserDto, userId: string) {
    const result = await this.getUser({ id: userId });
    const user = result.data;
    if (!user) return { statusCode: 400, message: 'User Error' };
    const role = await this.roleRepository.findOne({ name: user.role });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createdAt, updatedAt, ...res } = user;
    const newUser: UserEntity = await this.userRepository.save({
      ...res,
      role: role,
      name: userDto.name ? userDto.name : user.name,
      password:
        userDto.password === user.password
          ? user.password
          : await bcrypt.hash(userDto.password, SALT_OR_ROUNDS),
      birthday: userDto.birthday ? userDto.birthday : user.birthday,
      gender: userDto.gender ? userDto.gender : user.gender,
      phoneNumber: userDto.phoneNumber ? userDto.phoneNumber : user.phoneNumber,
    });

    if (!newUser) {
      return { statusCode: 500, message: 'Server Error' };
    }
    return {
      statusCode: 200,
      message: 'Update Successfully',
    };
  }

  generateJWTToken(data: any): string {
    const payload = {
      sub: data.id || null,
      email: data.email || null,
      role: data.role || null,
    };
    return this.jwtService.sign(payload);
  }
}

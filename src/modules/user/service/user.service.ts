import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleRepository } from 'src/modules/role/infrastructure/role.repository';
import { IUser } from '../domain/interfaces/IUser.interface';
import { CreateFacebookUserDto, CreateSystemUserDto, UserResponseDto } from '../dto/user.dto';
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

  private async saveUserToDatabase(newUser: IUser){
    // check empty email
    if(!newUser.email){
      throw new BadRequestException('Email is required');
    }
    // find User
    const user = await this.findOneUser({email: newUser.email})
    console.log(user, 'user');
    if(user){
      throw new BadRequestException('Email is already used');
    }
    // Get ID role
    newUser.roleId = (await this.roleRepository.findOne({ name: 'User' })).id;

    const result = await this.userRepository.save(newUser);
    return {
      statusCode: result ? 201 : 500,
      message: result ? 'Account have been created' : 'Server Error'
    }
  }

  async findOneUser(data:{[key:string]: string|number}){
    return this.userRepository.findOne(data)
  }

  async createSystemUser(
    userInfo: CreateSystemUserDto
  ){
    const saltOrRounds = 10;
    const userInformation: IUser= {
      name: userInfo.name,
      username: userInfo.email,
      email: userInfo.email,
      isSocial: false,
      password: await bcrypt.hash(userInfo.password, saltOrRounds),
    };
    return this.saveUserToDatabase(userInformation);
  }

  async createFacebookUser(
    userInfo: CreateFacebookUserDto
  ){
    const userInformation: IUser = {
      name: userInfo.name,
      username: userInfo.email,
      email: userInfo.email,
      isSocial: true,
    };
    return this.saveUserToDatabase(userInformation);
  }

  async getNewSystemUserInfo(
    userInfo: CreateSystemUserDto
  ): Promise<UserResponseDto> {
    const saltOrRounds = 10;
    const userInformation = {
      name: userInfo.name,
      username: userInfo.email,
      email: userInfo.email,
      password: await bcrypt.hash(userInfo.password, saltOrRounds),
    };
    await this.createUser(userInformation);

    return {
      statusCode: 200,
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

    const user = await this.userRepository.save(newUser);
    if (!user) throw new ForbiddenException();

    return user;
  }
}

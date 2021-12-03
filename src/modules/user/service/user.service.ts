<<<<<<< Updated upstream
import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleRepository } from 'src/modules/role/infrastructure/role.repository';
import { IUser } from '../domain/interfaces/IUser.interface';
import { CreateUserDto, UserResponseDto } from '../dto/user.dto';
import { UserRepository } from '../infrastructure/user.repository';
import * as bcrypt from 'bcrypt';

=======
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RoleRepository } from "src/modules/role/infrastructure/role.repository";
import { IUser } from "../domain/interfaces/IUser.interface";
import { CreateSystemUserDto, UserResponseDto } from "../dto/user.dto";
import { UserRepository } from "../infrastructure/user.repository";
import * as bcrypt from "bcrypt";
>>>>>>> Stashed changes

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(RoleRepository)
    private readonly roleRepository: RoleRepository,
  ) {
  }


<<<<<<< Updated upstream
  async createUser(userInfo: CreateUserDto): Promise<UserResponseDto> {
    const isConflictEmail = await this.userRepository.findOne({email: userInfo.email})
    if(isConflictEmail) throw new BadRequestException('Email is already used');
=======
  async createUser(userInfo: CreateSystemUserDto): Promise<UserResponseDto> {
    const isConflictEmail = await this.userRepository.findOne({ email: userInfo.email });
    if (isConflictEmail) throw new BadRequestException("Email is already used");
>>>>>>> Stashed changes

    const roleUser = (await this.roleRepository.findOne({ name: 'User' }));
    console.log(typeof(roleUser));
    
    if (!roleUser) throw new UnauthorizedException('Cant find user id ');

    // mapping
    const saltOrRounds = 10;
    const newUser: IUser = {
      email: userInfo.email,
      username: userInfo.email,
      password: await bcrypt.hash(userInfo.password, saltOrRounds),
      name: userInfo.name,
      role: roleUser,
    };
    

    const user = await this.userRepository.save(newUser);
    console.log(user);
    
    if (!user) throw new ForbiddenException();
    return {
      email: user.email,
      name: user.name,
<<<<<<< Updated upstream
      birthday: user.birthday
    }
=======
    };
>>>>>>> Stashed changes
  }
}

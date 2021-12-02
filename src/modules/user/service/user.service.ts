import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleRepository } from 'src/modules/role/infrastructure/role.repository';
import { IUser } from '../domain/interfaces/IUser.interface';
import { CreateUserDto, UserResponseDto } from '../dto/user.dto';
import { UserRepository } from '../infrastructure/user.repository';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(RoleRepository)
    private readonly roleRepository: RoleRepository,
  ) {
  }


  async createUser(userInfo: CreateUserDto): Promise<UserResponseDto> {
    const isConflictEmail = await this.userRepository.findOne({email: userInfo.email})
    if(isConflictEmail) throw new BadRequestException('email is already used');

    const roleUserId = (await this.roleRepository.findOne({ name: 'User' })).id;
    if (!roleUserId) throw new UnauthorizedException('Cant find user id ');

    const saltOrRounds = 10;
    const newUser: IUser = {
      email: userInfo.email,
      username: userInfo.email,
      password: await bcrypt.hash(userInfo.password, saltOrRounds),
      birthday: userInfo.birthday,
      name: userInfo.name,
      roleId: roleUserId,
    };

    const user = await this.userRepository.save(newUser);
    if (!user) throw new ForbiddenException();
    return {
      email: user.email,
      name: user.name,
      birthday: user.birthday
    }
  }
}

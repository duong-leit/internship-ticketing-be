import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RoleRepository } from "src/modules/role/infrastructure/role.repository";
import { IUser } from "../domain/interfaces/IUser.interface";
import { CreateUserDto, UserResponseDto } from "../dto/user.dto";
import { UserRepository } from "../infrastructure/user.repository";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(RoleRepository)
    private readonly roleRepository: RoleRepository
  ) {}

  async createUser(userInfo: CreateUserDto): Promise<UserResponseDto> {
    const isConflictEmail = await this.userRepository.findOne({ email: userInfo.email });
    if (isConflictEmail) throw new BadRequestException("Email is already used");

    const roleUser = (await this.roleRepository.findOne({ name: "User" }));
    if (!roleUser) throw new UnauthorizedException("Cant find user id ");
    console.log(roleUser);

    // mapping
    const saltOrRounds = 10;
    const newUser: IUser = {
      email: userInfo.email,
      username: userInfo.email,
      password: await bcrypt.hash(userInfo.password, saltOrRounds),
      birthday: null,
      name: userInfo.name,
      role: roleUser,
    };

    const user = await this.userRepository.save(newUser);

    if (!user) throw new ForbiddenException();
    return {
      email: user.email,
      name: user.name,
      birthday: user.birthday,
    };
  }
}

import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from 'src/modules/user/infrastructure/user.repository';
import { UserLoginDto } from '../infrastructure/dto/systemLogin.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { responseLoginDto } from '../infrastructure/dto/responseLogin.dto';
import { FacebookLoginDto } from '../infrastructure/dto/facebookLoginDto';
import { FacebookAuthService } from 'facebook-auth-nestjs';
import { RoleRepository } from 'src/modules/role/infrastructure/role.repository';
import { IFacebookData } from '../infrastructure/interface/facebook.interface';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private readonly fbService: FacebookAuthService,
    private roleRepository: RoleRepository
  ) {}

  async systemLogin(data: UserLoginDto): Promise<responseLoginDto> {
    const isExistUser = await this.userRepository.findOne({
      relations: ['role'],
      where: { username: data.username, isSocial: false },
    });
    if (!isExistUser) throw new UnauthorizedException('username is invalid');
    if (!bcrypt.compareSync(data.password, isExistUser.password)) {
      throw new UnauthorizedException('password is invalid');
    }
    return this.generateJWTToken(isExistUser);
  }

  async facebookLogin({ accessToken }: FacebookLoginDto): Promise<responseLoginDto> {
    const userInformation: IFacebookData = await this.fbService.getUser(
      accessToken,
      'id',
      'name',
      'email',
      'birthday'
    );

    if (!userInformation) throw new UnauthorizedException('user is invalid');
    let existUser = await this.userRepository.findOne({
      relations: ['role'],
      where: { username: userInformation.id, isSocial: true },
    });

    if (!existUser) {
      existUser = await this.userRepository.findOne({
        where: { email: userInformation.email },
      });

      if (existUser) {
        throw new ForbiddenException('Email is already used');
      }
      const roleUser = await this.roleRepository.findOne({ name: 'User' });
      if (!roleUser) throw new InternalServerErrorException();

      existUser = await this.userRepository.save({
        name: userInformation.name,
        username: userInformation.id,
        email: userInformation.email || null,
        birthday: userInformation.birthday || null,
        isSocial: true,
        password: '',
        role: roleUser || null,
      });
    }
    return this.generateJWTToken(existUser);
  }

  generateJWTToken(data: any): responseLoginDto {
    const payload = {
      sub: data.id,
      name: data.name,
      avatar: data.avatar,
      role: data.role.name,
    };
    return { token: this.jwtService.sign(payload) };
  }
}

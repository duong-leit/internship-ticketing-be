import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from 'src/modules/user/infrastructure/user.repository';
import { UserLoginDto } from '../infrastructure/dto/systemLogin.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { responseLoginDto } from '../infrastructure/dto/responseLogin.dto';
import { FacebookLoginDto } from '../infrastructure/dto/facebookLoginDto';
import { FacebookAuthService } from 'facebook-auth-nestjs';
import { RoleRepository } from 'src/modules/role/infrastructure/role.repository';
import { IFacebookData } from '../infrastructure/interface/facebook.interface';
import { UserService } from 'src/modules/user/service/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly fbService: FacebookAuthService,
    private readonly userService: UserService,
    private roleRepository: RoleRepository
  ) {}

  async systemLogin(data: UserLoginDto): Promise<responseLoginDto> {
    const existUser = await this.userRepository.findOne({
      relations: ['role'],
      where: { username: data.username, isSocial: false },
    });
    if (!existUser) throw new UnauthorizedException('username is invalid');
    if (!bcrypt.compareSync(data.password, existUser.password)) {
      throw new UnauthorizedException('password is invalid');
    }
    return {
      status: 200,
      token: this.generateJWTToken(existUser),
    };
  }

  async facebookLogin({
    accessToken,
  }: FacebookLoginDto): Promise<responseLoginDto> {
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
      existUser = await this.userService.createUser({
        email: userInformation.email || null,
        username: userInformation.id,
        birthday: userInformation.birthday || null,
        name: userInformation.name,
        isSocial: true,
      });
    }
    return {
      status: 200,
      token: this.generateJWTToken(existUser),
    };
  }

  generateJWTToken(data: any): string {
    const payload = {
      sub: data.id,
      name: data.name,
      avatar: data.avatar,
      role: data.role.name,
    };
    return this.jwtService.sign(payload);
  }
}

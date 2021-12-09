import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { FacebookAuthService } from 'facebook-auth-nestjs';
import { IFacebookData } from 'src/common/interface/common.interface';
import { UserService } from 'src/modules/user/service/user.service';
import {
  FacebookLoginDto,
  UserLoginDto,
} from '../infrastructure/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly fbService: FacebookAuthService,
    private readonly userService: UserService
  ) {}

  async systemLogin(data: UserLoginDto) {
    const user = await this.userService.getOneUser({ username: data.username });
    if (!user || !bcrypt.compareSync(data.password, user.password))
      return { statusCode: 400, message: 'Wrong username or password' };
    return {
      statusCode: 200,
      data: {
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      accessToken: this.generateJWTToken(user),
    };
  }

  async facebookLogin({
    avatarUrl,
    accessToken,
  }: FacebookLoginDto) {
    const userInformation: IFacebookData = await this.fbService.getUser(
      accessToken,
      'id',
      'name',
      'email',
      'birthday'
    );
    if (!userInformation)
      return { statusCode: 400, message: 'The token have been expired' };

    const user = await this.userService.getOneUser({
      username: userInformation.id,
    });
    if (!user) {
      return {
        statusCode: 401,
        data: {
          name: userInformation.name,
          email: userInformation.email ? userInformation.email : null,
          avatarUrl: avatarUrl,
        },
        accessToken: accessToken,
      };
    }

    return {
      statusCode: 200,
      data: {
        name: user.name,
        avatarUrl: avatarUrl,
      },
      accessToken: this.generateJWTToken(user),
    };
  }

  private generateJWTToken(data: any): string {
    const payload = {
      sub: data.id || null,
      email: data.email || null,
      role: data.role?.name || null,
    };
    return this.jwtService.sign(payload);
  }
}

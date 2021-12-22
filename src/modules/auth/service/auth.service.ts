import { forwardRef, Inject, Injectable, Scope } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { FacebookAuthService } from 'facebook-auth-nestjs';
import { IFacebookData } from 'src/common/interface/common.interface';
import { UserService } from 'src/modules/user/service/user.service';
import {
  FacebookLoginDto,
  UserLoginDto,
} from '../infrastructure/dto/login.dto';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly fbService: FacebookAuthService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {}

  async systemLogin(data: UserLoginDto) {
    const result = await this.userService.getUser({
      username: data.username,
    });
    if (
      result.statusCode === 404 ||
      !bcrypt.compareSync(data.password, result.data.password)
    )
      return { statusCode: 400, message: 'Wrong username or password' };
    return {
      statusCode: 200,
      data: {
        name: result.data.name,
        avatarUrl: result.data.avatarUrl,
      },
      accessToken: this.generateJWTToken(result.data),
    };
  }

  async refreshToken(userId: string) {
    const result = await this.userService.getUser({ id: userId });
    if (result.statusCode === 404)
      return { statusCode: 400, message: 'User have been deleted' };
    return {
      statusCode: 200,
      data: {
        name: result.data.name,
        avatarUrl: result.data.avatarUrl,
      },
      accessToken: this.generateJWTToken(result.data),
    };
  }

  async fetchFacebookInfo(accessToken: string) {
    try {
      const userInfo = await this.fbService.getUser(
        accessToken,
        'id',
        'name',
        'email',
        'birthday'
      );
      return {
        statusCode: 200,
        data: {
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          birthday: userInfo.birthday,
        },
      };
    } catch {
      return {
        statusCode: 400,
        message: 'Token Error',
      };
    }
  }

  async facebookLogin({ avatarUrl, accessToken }: FacebookLoginDto) {
    const userInfo: IFacebookData = await this.fbService.getUser(
      accessToken,
      'id',
      'name',
      'email',
      'birthday'
    );
    if (!userInfo)
      return { statusCode: 400, message: 'The token have been expired' };

    const result = await this.userService.getUser({
      username: userInfo.id,
    });
    if (result.statusCode === 404) {
      return {
        statusCode: 401,
        data: {
          name: userInfo.name,
          email: userInfo.email ? userInfo.email : null,
          avatarUrl: avatarUrl,
        },
        accessToken: accessToken,
      };
    }

    return {
      statusCode: 200,
      data: {
        name: result.data.name,
        avatarUrl: avatarUrl,
      },
      accessToken: this.generateJWTToken(result.data),
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

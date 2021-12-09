import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from 'src/modules/user/infrastructure/user.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { FacebookAuthService } from 'facebook-auth-nestjs';
import { IFacebookData } from 'src/common/interface/common.interface';
import { UserService } from 'src/modules/user/service/user.service';
import {
  FacebookLoginDto,
  responseLoginDto,
  UserLoginDto,
} from '../infrastructure/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly fbService: FacebookAuthService,
    private readonly userService: UserService
  ) {}

  async systemLogin(data: UserLoginDto) {
    const existUser = await this.userService.getByUsername(data.username);
    if (!existUser) throw new UnauthorizedException('Username is invalid');
    if (!bcrypt.compareSync(data.password, existUser.password)) {
      throw new UnauthorizedException('Password is invalid');
    }
    return {
      statusCode: 200,
      data: {
        name: existUser.name,
        avatar: existUser.avatar,
      },
      accessToken: this.generateJWTToken(existUser),
    };
  }

  async facebookLogin({
    avatarUrl,
    accessToken,
  }: FacebookLoginDto): Promise<responseLoginDto> {
    const userInformation: IFacebookData = await this.fbService.getUser(
      accessToken,
      'id',
      'name',
      'email',
      'birthday'
    );
    if (!userInformation) {
      throw new BadRequestException('The token have been expired');
    }

    const user = await this.userService.getOneUser({username: userInformation.id})
    if (!user) {
      return {
        statusCode: 401,
        data: {
          name: userInformation.name,
          email: userInformation.email ? userInformation.email : null,
          avatar: avatarUrl
        },
        accessToken: accessToken,
      };
    }

    return {
      statusCode: 200,
      data: {
        name: user.name,
        avatar: avatarUrl,
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

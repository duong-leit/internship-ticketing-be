import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from 'src/modules/user/infrastructure/user.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { FacebookAuthService } from 'facebook-auth-nestjs';
import { IFacebookData } from '../infrastructure/interface/facebook.interface';
import { UserService } from 'src/modules/user/service/user.service';
import { FacebookLoginDto, responseLoginDto, UserLoginDto } from '../infrastructure/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly fbService: FacebookAuthService,
    private readonly userService: UserService
  ) {}

  async systemLogin(data: UserLoginDto): Promise<responseLoginDto> {
    const existUser = await this.userRepository.findOne({
      relations: ['role'],
      where: { username: data.username, isSocial: false },
    });
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
    if (!userInformation)
      throw new BadRequestException('The token have been expired');

    const user = await this.userService.findOneUser({email: userInformation.email})
    if(!user){
      const result = await this.userService.createFacebookUser({
        username: userInformation.id,
        name: userInformation.name,
        birthday: userInformation.birthday,
        email: userInformation.email,
      })
      const newUser = await this.userService.findOneUser({email: userInformation.email})
      return {
        statusCode: result.statusCode!==201 ? result.statusCode : 200,
        message: result.statusCode!==201 ? result.message : undefined,
        data: result.statusCode!==201 ? undefined : {
          name: newUser.name,
          avatar: avatarUrl
        },
        accessToken: this.generateJWTToken(newUser)
      }
    }

    return{
      statusCode: 200,
      data: {
        name: user.name,
        avatar: avatarUrl,
      },
      accessToken: this.generateJWTToken(user)
    }

    // let existUser = await this.userRepository.findOne({
    //   relations: ['role'],
    //   where: { username: userInformation.id, isSocial: true },
    // });
    // const response = {
    //   statusCode: 200,
    //   data: { avatar: avatarUrl },
    //   accessToken: this.generateJWTToken(existUser),
    // };
    //
    // if (!existUser) {
    //   existUser = await this.userService.createUser({
    //     email: userInformation.email || null,
    //     username: userInformation.id,
    //     birthday: userInformation.birthday || null,
    //     name: userInformation.name,
    //     isSocial: true,
    //   });
    //
    //   if (existUser.avatar) response.data.avatar = existUser.avatar;
    // }
    // return response;
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

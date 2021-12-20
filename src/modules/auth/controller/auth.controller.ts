import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import {
  ApiBody,
  ApiForbiddenResponse,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from '../service/auth.service';
import { FacebookLoginDto, responseLoginDto, UserLoginDto } from '../infrastructure/dto/login.dto';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { Response } from 'express';
import { transferResponse } from '../../../common/utils/transferResponse';
import { Public, Roles } from '../roles.decorator';
import { RoleEnum } from '../../role/domain/enums/role.enum';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @Roles(RoleEnum.Admin, RoleEnum.User)
  async refreshToken(
    @Res() res: Response
  ){
    const response = await this.authService.refreshToken();
    transferResponse(res, response);
  }

  @Post('system-login')
  @Public()
  @Recaptcha({ action: 'login' })
  @ApiOkResponse({ type: responseLoginDto })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'username/password is invalid',
  })
  @ApiHeader({
    name: 'recaptcha',
    description: 'google recaptcha',
  })
  @ApiBody({ type: UserLoginDto })
  async login(
    @Body() user: UserLoginDto,
    @Res() res: Response,
  ) {
    const response = await this.authService.systemLogin(user);
    transferResponse(res, response)
  }

  @Post('system-login-without-recaptcha')
  @Public()
  @ApiOkResponse({ type: responseLoginDto })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'username/password is invalid',
  })
  @ApiBody({ type: UserLoginDto })
  async loginWithoutRecaptcha(
    @Body() user: UserLoginDto,
    @Res () res: Response
  ) {
    const response = await this.authService.systemLogin(user);
    transferResponse(res, response)
  }


  @Post('fb-login')
  @Public()
  @Recaptcha({ action: 'login' })
  @ApiOkResponse({ type: responseLoginDto })
  @ApiUnauthorizedResponse({ status: 401, description: 'user is invalid' })
  @ApiForbiddenResponse({
    status: 403,
    description: 'Email is already used for another account',
  })
  @ApiHeader({
    name: 'recaptcha',
    description: 'google recaptcha',
  })
  @ApiBody({ type: FacebookLoginDto })
  async facebookLogin(
    @Body() user: FacebookLoginDto,
    @Res() res: Response
  ) {
    const response = await this.authService.facebookLogin(user);
    transferResponse(res, response);
  }

  @Post('fb-login-without-recaptcha')
  @Public()
  @ApiOkResponse({ type: responseLoginDto })
  @ApiUnauthorizedResponse({ status: 401, description: 'user is invalid' })
  @ApiForbiddenResponse({
    status: 403,
    description: 'Email is already used for another account',
  })
  @ApiBody({ type: FacebookLoginDto })
  async facebookLoginWithoutRecaptcha(
    @Body() user: FacebookLoginDto,
    @Res() res: Response
  ) {
    const response = await this.authService.facebookLogin(user);
    transferResponse(res, response);
  }
}

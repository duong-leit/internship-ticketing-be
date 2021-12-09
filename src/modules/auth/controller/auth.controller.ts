import { Body, Controller, Post, Res } from '@nestjs/common';
import {
  ApiBody,
  ApiForbiddenResponse,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from '../service/auth.service';
import {
  FacebookLoginDto,
  responseLoginDto,
  UserLoginDto,
} from '../infrastructure/dto/login.dto';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { Response } from 'express';
import { transferResponse } from '../../../common/utils/transferResponse';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('system-login')
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
    @Res () res: Response
  ) {
    const response = await this.authService.systemLogin(user);
    transferResponse(res, response)
  }

  @Post('fb-login')
  // @Recaptcha({ action: 'login' })
  @ApiOkResponse({ type: responseLoginDto })
  @ApiUnauthorizedResponse({ status: 401, description: 'user is invalid' })
  @ApiForbiddenResponse({
    status: 403,
    description: 'Email is already used for another account',
  })
  @ApiBody({ type: FacebookLoginDto })
  async facebookLogin(
    @Body() user: FacebookLoginDto,
    @Res() res: Response
  ) {
    const response = await this.authService.facebookLogin(user);
    transferResponse(res, response);
  }
}

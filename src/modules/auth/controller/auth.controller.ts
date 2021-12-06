import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from '../service/auth.service';
import { FacebookLoginDto, responseLoginDto, UserLoginDto } from '../infrastructure/dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('system-login')
  @ApiOkResponse({ type: responseLoginDto })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'username/password is invalid',
  })
  @ApiBody({ type: UserLoginDto })
  login(@Body() user: UserLoginDto): Promise<responseLoginDto> {
    return this.authService.systemLogin(user);
  }

  @Post('fb-login')
  @ApiOkResponse({ type: responseLoginDto })
  @ApiUnauthorizedResponse({ status: 401, description: 'user is invalid' })
  @ApiForbiddenResponse({
    status: 403,
    description: 'Email is already used for another account',
  })
  @ApiBody({ type: FacebookLoginDto })
  async facebookLogin(@Body() user: FacebookLoginDto): Promise<responseLoginDto> {
    return await this.authService.facebookLogin(user);
  }
}

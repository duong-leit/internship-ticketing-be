import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FacebookLoginDto } from '../infrastructure/dto/facebookLoginDto';
import { responseLoginDto } from '../infrastructure/dto/responseLogin.dto';
import { UserLoginDto } from '../infrastructure/dto/systemLogin.dto';
import { AuthService } from '../service/auth.service';

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
  facebookLogin(@Body() user: FacebookLoginDto): Promise<responseLoginDto> {
    return this.authService.facebookLogin(user);
  }
}

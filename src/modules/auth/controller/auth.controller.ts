import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { responseLoginDto } from '../infrastructure/dto/responseLogin.dto';
import { UserLoginDto } from '../infrastructure/dto/systemLogin.dto';
import { AuthService } from '../service/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('system-login')
  @ApiOkResponse({ type: responseLoginDto })
  @ApiUnauthorizedResponse({ status: 401, description: 'username/password is invalid' })
  @ApiBody({ type: UserLoginDto })
  login(@Body() user: UserLoginDto): Promise<responseLoginDto> {
    return this.authService.systemLogin(user);
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiTags,
} from '@nestjs/swagger';
import { Recaptcha } from '@nestlab/google-recaptcha';
import {
  CreateFacebookUserDto,
  CreateSystemUserDto,
  UserResponseDto,
} from '../dto/user.dto';
import { UserService } from '../service/user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userServices: UserService) {}

  @Recaptcha({ action: 'register' })
  @Post('/register')
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Email is already used',
  })
  @ApiHeader({
    name: 'recaptcha',
    description: 'google recaptcha',
  })
  @ApiBody({ type: CreateSystemUserDto })
  registerUser(
    @Body() userInfo: CreateSystemUserDto
  ): Promise<UserResponseDto> {
    return this.userServices.createSystemUser(userInfo);
  }

  @Post('/facebookRegister')
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Email is already used',
  })
  @ApiBody({ type: CreateFacebookUserDto })
  registerFacebookUser(
    @Body() userInfo: CreateFacebookUserDto
  ): Promise<UserResponseDto> {
    return this.userServices.createFacebookUser(userInfo);
  }
}

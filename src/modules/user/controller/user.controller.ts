import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
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

  @Post('/register')
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Email is already used',
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

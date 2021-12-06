import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateSystemUserDto, UserResponseDto } from '../dto/user.dto';
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
  @ApiForbiddenResponse({
    description: 'Forbidden.',
  })
  @ApiBody({ type: CreateSystemUserDto })
  createUser(
    @Body() userInfo: CreateSystemUserDto
  ): Promise<UserResponseDto> {
    return this.userServices.createSystemUser(userInfo);
  }
}

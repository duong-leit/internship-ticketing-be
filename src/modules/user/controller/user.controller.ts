import { Body, Controller, Param, Post, Res } from '@nestjs/common';
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
  CreateSystemUserDto, GetListUserDto,
  UserResponseDto,
} from '../dto/user.dto';
import { UserService } from '../service/user.service';
import { transferResponse } from '../../../common/utils/transferResponse';
import {Response} from 'express';


@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userServices: UserService) {}

  @Post()
  @ApiBody({
    type: GetListUserDto
  })
  @ApiBadRequestResponse()
  async getUserPaging(
    @Param() param: {id: string},
    @Body() data: {
      filter:{
        [key: string]: string | number
      },
      pagination: {
        pageSize: number, pageIndex: number
      }
    },
    @Res() res: Response
  ){
    const response = await this.userServices.getListUser(
      {...data.filter},
      {arrayRelation: ['role']},
      {pageSize: data.pagination.pageSize,
        pageIndex: data.pagination.pageIndex},
    )
    transferResponse(res, response)
  }

  @Post('/register')
  @Recaptcha({ action: 'register' })
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
  async registerUser(
    @Body() userInfo: CreateSystemUserDto,
    @Res () res: Response
  ) {
    const response = await this.userServices.createSystemUser(userInfo);
    transferResponse(res, response);
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

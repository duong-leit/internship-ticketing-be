import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiTags,
} from '@nestjs/swagger';
import { Recaptcha } from '@nestlab/google-recaptcha';
import {
  CreateFacebookUserDto,
  CreateSystemUserDto,
  GetListUserDto,
  UpdateUserDto,
  UserResponseDto,
} from '../dto/user.dto';
import { UserService } from '../service/user.service';
import { transferResponse } from '../../../common/utils/transferResponse';
import { Response } from 'express';
import { BankService } from '../service/bank.service';
import { AuthService } from '../../auth/service/auth.service';
import { Public, Roles } from '../../auth/decorators/roles.decorator';
import { RoleEnum } from '../../role/domain/enums/role.enum';
import { BankRequestDto } from '../dto/bank.dto';
import { User } from 'src/modules/auth/decorators/user.decorator';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private userServices: UserService,
    private bankService: BankService,
    private readonly authService: AuthService
  ) {}

  @Get('info')
  @ApiBearerAuth()
  @Roles(RoleEnum.User, RoleEnum.Admin)
  async getUserInfo(@Res() res: Response, @User('userId') userId: string) {
    const response = await this.userServices.getUserInfo(userId);
    transferResponse(res, response);
  }

  @Post('bank')
  @ApiBearerAuth()
  @Roles(RoleEnum.User, RoleEnum.Admin)
  async createBank(
    @Res() res: Response,
    @Body() bankDto: BankRequestDto,
    @User('userId') userId: string
  ) {
    const response = await this.bankService.createBank(userId, bankDto);
    if (response['error']) {
      transferResponse(res, { statusCode: 400, message: response['message'] });
    }
    transferResponse(res, { statusCode: 200, data: response });
  }

  @Get('bank/:bankId')
  @Roles(RoleEnum.User, RoleEnum.Admin)
  async getBankById(@Param('bank ID') bankId: string, @Res() res: Response) {
    const response = await this.bankService.getBank({ id: bankId });
    transferResponse(res, response);
  }

  @Get('bank')
  @ApiBearerAuth()
  @Roles(RoleEnum.User, RoleEnum.Admin)
  async getBanks(
    @Query('pageSize') pageSize: number,
    @Query('pageIndex') pageIndex: number,
    @Res() res: Response,
    @User('userId') userId: string
  ) {
    const response = await this.bankService.getBanks(userId, {
      pageSize,
      pageIndex,
    });
    if (response['error']) {
      transferResponse(res, { statusCode: 400, message: response['message'] });
    }
    transferResponse(res, { statusCode: 200, ...response });
  }

  @Post()
  @Roles(RoleEnum.Admin)
  @ApiBearerAuth()
  @ApiBody({
    type: GetListUserDto,
  })
  @ApiBadRequestResponse()
  async getUserPaging(
    @Param() param: { id: string },
    @Body()
    data: {
      filter: {
        [key: string]: string | number;
      };
      pagination: {
        pageSize: number;
        pageIndex: number;
      };
    },
    @Res() res: Response
  ) {
    const filter = data.filter ?? data.filter;
    const pagination = data.pagination ?? {
      pageSize: data.pagination?.pageSize,
      pageIndex: data.pagination?.pageIndex,
    };

    const response = await this.userServices.getUsers(
      { ...filter },
      { arrayRelation: ['role'] },
      { ...pagination }
    );
    transferResponse(res, response);
  }

  @Public()
  @Post('register')
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
    @Res() res: Response
  ) {
    const response = await this.userServices.createSystemUser(userInfo);
    transferResponse(res, response);
  }

  @Public()
  @Post('/facebookRegister')
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Email is already used',
  })
  @ApiBody({ type: CreateFacebookUserDto })
  async registerFacebookUser(
    @Body() createFacebookUserDto: CreateFacebookUserDto,
    @Res() res: Response
  ) {
    const userInfo = await this.authService.fetchFacebookInfo(
      createFacebookUserDto.accessToken
    );
    if (userInfo.statusCode !== 200) {
      transferResponse(res, userInfo);
      return;
    }
    const response = await this.userServices.createFacebookUser(
      createFacebookUserDto,
      userInfo.data
    );
    transferResponse(res, response);
  }

  @Put()
  @Roles(RoleEnum.User, RoleEnum.Admin)
  async updateUser(
    @Body() userDto: UpdateUserDto,
    @Res() res: Response,
    @User('userId') userId: string
  ) {
    const response = await this.userServices.update(userDto, userId);
    transferResponse(res, response);
  }
}

import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RoleService } from '../service/role.service';
import {
  PermissionRequestDto,
  RolePermissionRequestDto,
  RoleRequestDto,
} from '../dto/role.dto';
import { transferResponse } from '../../../common/utils/transferResponse';
import { Response } from 'express';

@ApiTags('Role and Permission')
@Controller('')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get()
  async getAllRolePermission(
    @Res() res: Response
  ){
    const response = await this.roleService.getAllRolePermission();
    transferResponse(res, response);
  }

  @Post('/role')
  @ApiCreatedResponse({
    description: 'The role created.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden.',
  })
  @ApiBody({ type: RoleRequestDto })
  async createRole(@Body() body: { name: string }) {
    return this.roleService.createRole(body);
  }

  @Post('/permission')
  @ApiCreatedResponse({
    description: 'The permission created.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden.',
  })
  @ApiBody({ type: PermissionRequestDto })
  async createPermission(@Body() body: { name: string }) {
    return this.roleService.createPermission(body);
  }

  @Post('/updateRolePermission')
  @ApiCreatedResponse({
    description: 'The permissions of role have been created.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden.',
  })
  @ApiBody({ type: [RolePermissionRequestDto] })
  async updateRolePermission(
    @Body() rolePermissionRequest: RolePermissionRequestDto[]
  ) {
    return this.roleService.updateRolePermission(rolePermissionRequest);
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleRepository } from '../infrastructure/role.repository';
import { PermissionRepository } from '../infrastructure/permisson.repository';
import { RolePermissionRepository } from '../infrastructure/rolePermisson.repository';
import {
  PermissionRequestDto,
  RolePermissionRequestDto,
  RoleRequestDto,
} from '../dto/role.dto';
import { IRolePermissionInterface } from '../domain/interfaces/IRolePermission.interface';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleRepository)
    private readonly roleRepository: RoleRepository,
    @InjectRepository(PermissionRepository)
    private readonly permissionRepository: PermissionRepository,
    @InjectRepository(RolePermissionRepository)
    private readonly rolePermissionRepository: RolePermissionRepository
  ) {}

  private async compareRolePermission(
    newRPArray: RolePermissionRequestDto[],
    oldRPArray: IRolePermissionInterface[]
  ) {
    const addArray: IRolePermissionInterface[] = [];
    const updateArray: IRolePermissionInterface[] = [];
    const deleteArray: IRolePermissionInterface[] = [];

    // check new or exist role permission
    newRPArray.forEach((_newRP) => {
      const rolePermission = oldRPArray.find(
        (_oldRP) =>
          _newRP.roleId === _oldRP.roleId &&
          _newRP.permissionId === _oldRP.permissionId
      );
      rolePermission
        ? updateArray.push(rolePermission)
        : addArray.push(rolePermission);
    });
    // check delete role permission
    oldRPArray.forEach((_oldRP) => {
      const rolePermission = newRPArray.find(
        (_newRP) =>
          _newRP.roleId === _oldRP.roleId &&
          _newRP.permissionId === _oldRP.permissionId
      );
      !rolePermission && deleteArray.push(_oldRP);
    });

    return {
      add: addArray,
      update: updateArray,
      delete: deleteArray,
    };
  }

  async createPermission(body: PermissionRequestDto) {
    const isExistPermission = await this.permissionRepository.findOne(body);
    if (isExistPermission) {
      throw new BadRequestException('This permission have been created');
    }

    return await this.permissionRepository.save(body);
  }

  async createRole(body: RoleRequestDto) {
    const isExistRole = await this.roleRepository.findOne(body);
    if (isExistRole) {
      throw new BadRequestException('This role have been created');
    }
    return await this.roleRepository.save(body);
  }

  async getAllRolePermission() {
    const role = await this.roleRepository.find();
    const permission = await this.permissionRepository.find();
    const rolePermission = (await this.rolePermissionRepository.find()).map(
      (_rolePermission) => ({
        roleId: _rolePermission.roleId,
        permissionId: _rolePermission.permissionId,
      })
    );

    return {
      statusCode: 200,
      data: {
        role,
        permission,
        rolePermission,
      }
    };
  }

  async updateRolePermission(
    rolePermissionRequest: RolePermissionRequestDto[]
  ) {
    const rolePermissionDB: IRolePermissionInterface[] = (
      await this.rolePermissionRepository.find()
    ).map((_rolePermission) => ({
      roleId: _rolePermission.roleId,
      permissionId: _rolePermission.permissionId,
    }));

    const result = await this.compareRolePermission(
      rolePermissionRequest,
      rolePermissionDB
    );

    // add new role permission
    for (const _newRP of result.add) {
      (await this.rolePermissionRepository.save(_newRP));
    }
    // delete ole role permission
    for (const _oldRP of result.delete) {
      await this.rolePermissionRepository.delete(_oldRP);
    }

    return true;
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleRepository } from './infrastructure/role.repository';
import { PermissionRepository } from './infrastructure/permisson.repository';
import { RolePermissionRepository } from './infrastructure/rolePermisson.repository';

@Module({
  imports: [TypeOrmModule.forFeature([
    RoleRepository,
    PermissionRepository,
    RolePermissionRepository
  ])],
  exports: [TypeOrmModule],
})
export class RoleModule {}
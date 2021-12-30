import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleRepository } from './infrastructure/role.repository';
import { PermissionRepository } from './infrastructure/permisson.repository';
import { RolePermissionRepository } from './infrastructure/rolePermisson.repository';
import { RoleController } from './controller/role.controller';
import { RoleService } from './service/role.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    RoleRepository,
    PermissionRepository,
    RolePermissionRepository
  ])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [TypeOrmModule],
})
export class RoleModule {}
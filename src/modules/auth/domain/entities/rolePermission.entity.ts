import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { PermissionEntity } from './permission.entity';
import { RoleEntity } from './role.entity';
@Entity('RolePermission')
export class RolePermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => RoleEntity, (role: RoleEntity) => role.id)
  role: string;

  @ManyToOne(() => PermissionEntity, (permission: PermissionEntity) => permission.id)
  permission: PermissionEntity;
}

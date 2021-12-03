import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PermissionEntity } from './permission.entity';
import { RoleEntity } from './role.entity';


@Entity('RolePermission')
export class RolePermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'uuid', name: 'roleId'})
  roleId: string;

  @Column({type: 'uuid', name: 'permissionId'})
  permissionId: string

  @ManyToOne(() => RoleEntity, (role: RoleEntity) => role.id)
  @JoinColumn({name: 'roleId'})
  role: string;

  @ManyToOne(() => PermissionEntity, (permission: PermissionEntity) => permission.id)
  @JoinColumn({name: 'permissionId'})
  permission: PermissionEntity;
}

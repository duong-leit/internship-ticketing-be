import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RolePermissionEntity } from './rolePermission.entity';

@Entity('Permission')
export class PermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @OneToMany(() => RolePermissionEntity, (rolePermissions: RolePermissionEntity) => rolePermissions.permission)
  rolePermissions!: RolePermissionEntity[];
}

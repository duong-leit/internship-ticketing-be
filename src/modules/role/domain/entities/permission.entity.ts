import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RolePermissionEntity } from './rolePermission.entity';


@Entity('Permission')
export class PermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  name: string;

  @OneToMany(
    () => RolePermissionEntity, (rolePermissions: RolePermissionEntity) => rolePermissions.permission)
  rolePermissions!: RolePermissionEntity[];
}

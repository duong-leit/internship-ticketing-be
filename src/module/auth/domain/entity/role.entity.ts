import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { RolePermissionEntity } from './rolePermission.entity';
@Entity('Role')
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @OneToMany(() => RolePermissionEntity, (permissions: RolePermissionEntity) => permissions.role)
  permissions!: RolePermissionEntity[];
}

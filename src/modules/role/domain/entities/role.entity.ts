import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RolePermissionEntity } from './rolePermission.entity';
import { UserEntity } from '../../../user/domain/entities/user.entity';


@Entity('Role')
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @OneToMany(
    ()=> UserEntity,
    (user: UserEntity)=> user.id)
  users!: UserEntity[];

  @OneToMany(
    () => RolePermissionEntity,
    (permissions: RolePermissionEntity) => permissions.role)
  permissions!: RolePermissionEntity[];
}

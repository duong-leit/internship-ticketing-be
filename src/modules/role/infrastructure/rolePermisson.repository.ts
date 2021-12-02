import { EntityRepository, Repository } from 'typeorm';
import { RolePermissionEntity } from '../domain/entities/rolePermission.entity';


@EntityRepository(RolePermissionEntity)
export class RolePermissionRepository extends Repository<RolePermissionEntity> {
}
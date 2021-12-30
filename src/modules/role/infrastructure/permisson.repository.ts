import { EntityRepository, Repository } from "typeorm";
import { PermissionEntity } from '../domain/entities/permission.entity';

@EntityRepository(PermissionEntity)
export class PermissionRepository extends Repository<PermissionEntity> {}
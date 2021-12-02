import { EntityRepository, Repository } from "typeorm";
import { RoleEntity } from "../domain/entities/role.entity";

@EntityRepository(RoleEntity)
export class RoleRepository extends Repository<RoleEntity> {}
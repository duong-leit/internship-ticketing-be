import { EntityRepository, Repository } from "typeorm";
import { UserEntity } from "../domain/entities/user.entity";

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {}
import { RoleEntity } from "src/modules/role/domain/entities/role.entity";

export interface IUser {
  email?: string;

  name?: string;

  username?: string;

  password?: string;

  birthday?: string;

  role?: RoleEntity;
}

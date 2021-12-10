import { RoleEntity } from '../../../role/domain/entities/role.entity';
import { GenderEnum } from '../enums/gender.enum';

export interface IUser {
  id? : string;

  email?: string;

  name?: string;

  username?: string;

  password?: string;

  birthday?: string;

  gender?: GenderEnum;

  phoneNumber?: string;

  avatarUrl?: string;

  roleId?: string;

  role?: RoleEntity;

  createdAt? : string;

  isSocial?: boolean;
}

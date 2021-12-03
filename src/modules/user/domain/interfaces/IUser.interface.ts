<<<<<<< Updated upstream
import { RoleEntity } from "src/modules/role/domain/entities/role.entity";
=======
import { RoleEntity } from '../../../role/domain/entities/role.entity';
import { GenderEnum } from '../enums/gender.enum';
>>>>>>> Stashed changes

export interface IUser {
  email?: string;

  name?: string;

  username?: string;

  password?: string;

  birthday?: string;

  gender?: GenderEnum;

  phoneNumber?: string;

  avatar?: string;

  role?: RoleEntity;
}

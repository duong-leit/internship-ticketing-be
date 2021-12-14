import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '../role/domain/enums/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...role: RoleEnum[]) => SetMetadata(ROLES_KEY, role);

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

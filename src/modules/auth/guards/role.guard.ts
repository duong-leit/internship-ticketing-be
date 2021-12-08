import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from 'src/modules/role/domain/enums/role.enum';
import { IS_PUBLIC_KEY, ROLES_KEY } from '../roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );
    if (isPublic) return true;

    console.log(isPublic, requiredRoles);
    console.log('year');
    if (!requiredRoles) {
      return false;
    }
    const user = context.switchToHttp().getRequest();
    console.log({ role: 'Admin' });
    console.log('hello', user?.role == requiredRoles);
    return user?.role == requiredRoles || true;
  }
}

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ACCOUNT_ROLE } from '@/core/constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<ACCOUNT_ROLE[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return false;
    }
    const { user } = context.switchToHttp().getRequest();
    const account = user['payload'];
    for (let i = 0; i < requiredRoles.length; i++) {
      if (requiredRoles[i] === account.role) {
        return true;
      }
    }
  }
}

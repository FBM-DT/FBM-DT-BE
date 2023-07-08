import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ACCOUNT_ROLE } from '../../../core/constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<ACCOUNT_ROLE>(
      'role',
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return false;
    }
    const { user } = context.switchToHttp().getRequest();
    const account = user['payload'];
    if (requiredRoles !== account.role) {
      return false;
    }

    if (requiredRoles === account.role) return true;
  }
}

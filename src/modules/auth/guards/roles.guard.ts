import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ACCOUNT_ROLE } from '../../../core/constants';
import { CustomHttpException } from '../../../core/shared/custom.http.exception';

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
      throw new CustomHttpException('Access denied', HttpStatus.FORBIDDEN);
    }

    if (requiredRoles === account.role) return true;
  }
}

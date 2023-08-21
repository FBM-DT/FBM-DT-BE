import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ACCOUNT_ROLE } from '../../constants';
import { JwtAuthGuard, RolesGuard } from '../../../modules/auth/guards';
import { HasRoles } from './role.decorator';

export function Auth(...roles: ACCOUNT_ROLE[]) {
  return roles.length === 0
    ? applyDecorators(UseGuards(JwtAuthGuard), ApiBearerAuth('token'))
    : applyDecorators(
        UseGuards(JwtAuthGuard, RolesGuard),
        HasRoles(...roles),
        ApiBearerAuth('token'),
      );
}

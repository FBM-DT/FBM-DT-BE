import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ACCOUNT_ROLE } from '@/core/constants';
import { JwtAuthGuard, RolesGuard } from '@/modules/auth/guards';
import { HasRoles } from './role.decorator';

export function Auth(role?: ACCOUNT_ROLE) {
  return !role
    ? applyDecorators(UseGuards(JwtAuthGuard), ApiBearerAuth('token'))
    : applyDecorators(
        UseGuards(JwtAuthGuard, RolesGuard),
        HasRoles(role),
        ApiBearerAuth('token'),
      );
}

import { SetMetadata } from '@nestjs/common';
import { ACCOUNT_ROLE } from '../../../core/constants';

export const HasRoles = (...roles: ACCOUNT_ROLE[]) =>
  SetMetadata('roles', roles);

import { SetMetadata } from '@nestjs/common';
import { ACCOUNT_ROLE } from '../../../core/constants';

export const HasRoles = (role: ACCOUNT_ROLE) => SetMetadata('role', role);

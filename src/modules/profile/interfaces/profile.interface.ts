import { DEPARTMENT, GENDER } from '../../../core/constants';

export interface IUserPayload {
  fullname?: string;
  dateOfBirth?: Date;
  gender?: GENDER;
  address?: string;
  email?: string;
  department?: DEPARTMENT;
  startDate?: Date;
  endDate?: Date;
  avatar?: string;
}

export interface IAccountPayload {
  roleId?: number;
  phonenumber?: string;
}

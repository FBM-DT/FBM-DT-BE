import { GENDER } from '../../../core/constants';

export interface IUserPayload {
  fullname?: string;
  dateOfBirth?: Date;
  gender?: GENDER;
  address?: string;
  email?: string;
  departmentId?: number;
  startDate?: Date;
  endDate?: Date;
  avatar?: string;
  department?: {
    id?: number;
    name?: string;
  };
  accounts?: IAccountPayload[];
}

export interface IAccountPayload {
  id?: number;
  roleId?: number;
  phonenumber?: string;
  password?: string;
}

export interface IAccountData {
  payload: {
    role: string;
  };
}
export interface IProfile {
  user_fullname: string;
  user_dateOfBirth: Date;
  user_gender: GENDER;
  user_address: string;
  user_email: string;
  user_departmentId: number;
  user_startDate: Date;
  user_endDate: Date;
  user_avatar: string;
  department_id: number;
  department_name: string;
  account_id: number;
  account_roleId: number;
  account_phonenumber: string;
  row: number;
}

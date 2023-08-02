import { ShareResDto } from '../../../../core/shared/response';

export class CreateAccountResDto extends ShareResDto {}
export class GetAllAccountsResDto extends ShareResDto {}
export class GetAccountResDto extends ShareResDto {
  id?: number;
  phonenumber?: string;
  password?: string;
  roleId?: number;
  userId?: number;
  refreshToken?: string;
  role?: {
    id: number;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
  };
  user?: {
    id: number;
    fullname: string;
    email: string;
    dateOfBirth?: Date;
    avatar: string;
    createdAt?: Date;
    updatedAt?: Date;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
export class GetAccountByPhoneNumberResDto extends ShareResDto {}
export class SigninResDto extends ShareResDto {
  accessToken?: string;
  refreshToken?: string;
}
export class RefreshTokenResDto extends ShareResDto {
  accessToken?: string;
  refreshToken?: string;
}
export class LogoutResDto extends ShareResDto {}
export class UpdateAccountResDto extends ShareResDto {}
export class ChangePasswordResDto extends ShareResDto {}
export class SendOtpResDto extends ShareResDto {}

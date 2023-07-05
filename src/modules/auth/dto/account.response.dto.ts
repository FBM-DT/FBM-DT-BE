import { ShareResponseDto } from '../../../core/shared/share.response.dto';

export class CreateAccountResponseDto extends ShareResponseDto {}
export class GetAccountListResponseDto extends ShareResponseDto {}
export class ValidateAccountResponseDto extends ShareResponseDto {}
export class GetAccountByIdResponseDto extends ShareResponseDto {
  id: number;
  phonenumber: string;
  password: string;
  roleId: number;
  userId: number;
  refreshToken?: string;
  role: {
    id: number;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
  };
  user: {
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
export class GetAccountByPhoneNumberResponseDto extends ShareResponseDto {}
export class GetAccountByQueriesResponseDto extends ShareResponseDto {}
export class SignInResponseDto extends ShareResponseDto {
  accessToken: string;
  refreshToken: string;
}
export class UpdateAccountResponseDto extends ShareResponseDto {}

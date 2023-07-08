import { ShareResponseDto } from '../../../../core/shared/share.response.dto';

export class CreateAccountResDto extends ShareResponseDto {}
export class GetAllAccountsResDto extends ShareResponseDto {}
export class GetAccountResDto extends ShareResponseDto {
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
export class GetAccountByPhoneNumberResDto extends ShareResponseDto {}
export class GetAccountByQueriesResponseDto extends ShareResponseDto {}
export class SignInResDto extends ShareResponseDto {
  accessToken: string;
  refreshToken: string;
}
export class UpdateAccountResDto extends ShareResponseDto {}

import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { ACCOUNT_ROLE } from '../../../../core/constants';

export class CreateAccountReqDto {
  @IsNotEmpty({ message: 'The phone number is required' })
  @IsString()
  @MinLength(10)
  @MaxLength(10)
  @ApiProperty()
  readonly phonenumber: string;

  @IsNotEmpty({ message: 'The password is required' })
  @IsString()
  @MinLength(8)
  @ApiProperty()
  readonly password: string;

  @IsNotEmpty({ message: 'The roleId is required' })
  @IsInt()
  @ApiProperty()
  readonly roleId: number;

  @IsNotEmpty({ message: 'The userId is required' })
  @IsInt()
  @ApiProperty()
  readonly userId: number;

  @IsOptional()
  @IsString()
  readonly refreshToken?: string;
}

export class UpdateAccountReqDto extends PartialType(CreateAccountReqDto) {}

export class UpdateAccountByIdRequestDto {
  @IsOptional()
  @IsString({ message: 'The phone number must be string type' })
  @ApiProperty()
  readonly phonenumber?: string;

  @IsOptional()
  @IsString({ message: 'The password must be string type' })
  @ApiProperty()
  readonly password?: string;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  readonly roleId?: number;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  readonly userId?: number;

  @IsOptional()
  @IsString()
  readonly refreshToken?: string;
}

export class SigninReqDto {
  @IsNotEmpty({ message: 'The phone number is required' })
  @IsString()
  @ApiProperty()
  readonly phonenumber: string;

  @IsNotEmpty({ message: 'The password is required' })
  @IsString()
  @ApiProperty()
  readonly password: string;
}

export class ChangePasswordReqDto {
  @IsNotEmpty({ message: 'The current password is required' })
  @IsString()
  @MinLength(8)
  @ApiProperty()
  currentPassword: string;

  @IsNotEmpty({ message: 'The new password is required' })
  @IsString()
  @MinLength(8)
  @ApiProperty()
  newPassword: string;

  @IsNotEmpty({ message: 'The confirm password is required' })
  @IsString()
  @MinLength(8)
  @ApiProperty()
  confirmPassword: string;
}

export class ForgotPasswordReqDto {
  @IsNotEmpty({ message: 'The phone number is required' })
  @IsString()
  @MinLength(10)
  @ApiProperty()
  phonenumber: string;
}

export class QueriesAccountReqDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  phonenumber: string;

  @IsEnum(ACCOUNT_ROLE)
  @IsOptional()
  @ApiProperty({
    required: false,
    enum: ACCOUNT_ROLE,
  })
  role: string;
}

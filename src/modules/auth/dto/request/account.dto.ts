import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountReqDto {
  @IsNotEmpty({ message: 'The phone number is required' })
  @IsString()
  @ApiProperty()
  readonly phonenumber: string;

  @IsNotEmpty({ message: 'The password is required' })
  @IsString()
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

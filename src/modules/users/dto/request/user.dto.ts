import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  IsDateString,
  IsInt,
  MaxLength,
  MinLength,
} from 'class-validator';
import { DEPARTMENT, GENDER } from '../../../../core/constants';
import { ApiProperty } from '@nestjs/swagger';

export class AddUserProfileReqDto {
  @IsNotEmpty({ message: 'The full name is required' })
  @IsString({ message: 'The full name must be string type' })
  @ApiProperty({ example: 'Nguyen Van A' })
  fullname: string;

  @IsOptional()
  @IsDateString({}, { message: 'The date of birth must be date type' })
  @ApiProperty({
    example: '2021-01-01',
    required: false,
  })
  dateOfBirth?: Date;

  @IsOptional()
  @IsEnum(GENDER, {
    message: `The type of gender must be belonged to the enum ${Object.values(
      GENDER,
    )}`,
  })
  @ApiProperty({ enum: [GENDER.FEMALE, GENDER.MALE, GENDER.OTHER] })
  gender?: GENDER;

  @IsNotEmpty({ message: 'The phone number is required' })
  @IsOptional()
  @ApiProperty({ example: '15 Mai Thuc Lan', required: false })
  address?: string;

  @IsNotEmpty({ message: 'The email is required' })
  @IsEmail({}, { message: 'The email is invalid' })
  @ApiProperty({ example: 'example@gmail.com' })
  email: string;

  @IsOptional()
  @IsEnum(DEPARTMENT, {
    message: 'The type of department must be belonged to the enum',
  })
  @ApiProperty({ enum: [...Object.values(DEPARTMENT)] })
  department?: DEPARTMENT;

  @IsOptional()
  @IsDateString({}, { message: 'The start date must be date type' })
  @ApiProperty({ example: '2021-01-01' })
  startDate?: Date;

  @IsOptional()
  @IsDateString({}, { message: 'The end date must be date type' })
  @ApiProperty({ example: '2021-01-02', required: false })
  endDate?: Date;

  @IsOptional()
  @ApiProperty({ example: 'https://i.pravatar.cc/300', required: false })
  avatar?: string;

  @IsNotEmpty({ message: 'The phone number is required' })
  @IsString()
  @MaxLength(10)
  @ApiProperty({
    example: '0123456789',
  })
  phonenumber: string;

  @IsNotEmpty({ message: 'The password is required' })
  @IsString()
  @MinLength(8)
  @ApiProperty({
    example: '12345678',
  })
  password: string;

  @IsNotEmpty({ message: 'The roleId is required' })
  @IsInt()
  @ApiProperty({
    example: 1,
  })
  roleId: number;
}

export class UpdateUserProfileReqDto {
  @IsOptional()
  @IsString({ message: 'The full name must be string type' })
  @ApiProperty({ example: 'Nguyen Van A' })
  fullname?: string;

  @IsOptional()
  @IsDateString({}, { message: 'The date of birth must be date type' })
  @ApiProperty({
    example: '2021-01-01',
    required: false,
  })
  dateOfBirth?: Date;

  @IsOptional()
  @IsEnum(GENDER, {
    message: `The type of gender must be belonged to the enum ${Object.values(
      GENDER,
    )}`,
  })
  @ApiProperty({ enum: [GENDER.FEMALE, GENDER.MALE, GENDER.OTHER] })
  gender?: GENDER;

  @IsOptional()
  @IsOptional()
  @ApiProperty({ example: '15 Mai Thuc Lan', required: false })
  address?: string;

  @IsOptional()
  @IsEmail({}, { message: 'The email is invalid' })
  @ApiProperty({ example: 'example@gmail.com' })
  email?: string;

  @IsOptional()
  @IsEnum(DEPARTMENT, {
    message: 'The type of department must be belonged to the enum',
  })
  @ApiProperty({ enum: [...Object.values(DEPARTMENT)] })
  department?: DEPARTMENT;

  @IsOptional()
  @IsDateString({}, { message: 'The start date must be date type' })
  @ApiProperty({ example: '2021-01-01' })
  startDate?: Date;

  @IsOptional()
  @IsDateString({}, { message: 'The end date must be date type' })
  @ApiProperty({ example: '2021-01-02', required: false })
  endDate?: Date;

  @IsOptional()
  @ApiProperty({ example: 'https://i.pravatar.cc/300', required: false })
  avatar?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  @ApiProperty({
    example: '0123456789',
  })
  phonenumber?: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({
    example: 1,
  })
  roleId?: number;
}

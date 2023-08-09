import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  IsDateString,
  ValidateNested,
  IsArray,
  ArrayMinSize,
  IsInt,
  MaxLength,
  MinLength,
} from 'class-validator';
import { DEPARTMENT, GENDER } from '../../../../core/constants';
import { PaginationReqDto } from '../../../../core/shared/request';
import { IsAfterStartDate } from '../../../../core/utils/decorators/date';
class Sort {
  sortBy: string;
  sortValue: string;
}

export class AddProfileReqDto {
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
  @IsAfterStartDate('startDate', {
    message: 'The end date must be after start date',
  })
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

export class UpdateProfileReqDto extends PartialType(
  OmitType(AddProfileReqDto, ['password'] as const),
) {}

export default class GetProfilesReqDto extends PaginationReqDto {
  @IsOptional()
  @IsArray({ message: 'The sort must be an array' })
  @ArrayMinSize(1)
  @ValidateNested({ each: true, context: Sort })
  readonly sort?: Sort[];

  @IsOptional()
  @IsString({ message: 'The email must be a string' })
  readonly email?: string;

  @IsOptional()
  @IsString({ message: 'The address must be a string' })
  readonly address?: string;

  @IsOptional()
  @IsString({ message: 'The fullname must be a string' })
  readonly fullname?: string;

  @IsOptional()
  @IsString({ message: 'The gender must be a string' })
  readonly gender?: string;

  @IsOptional()
  @IsString({ message: 'The department must be a string' })
  readonly department?: string;
}

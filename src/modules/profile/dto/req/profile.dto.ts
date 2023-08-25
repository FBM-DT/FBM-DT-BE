import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
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
  IsNumber,
  IsNumberString,
} from 'class-validator';
import { PaginationReqDto } from '@BE/core/shared/request';
import { IsAfterStartDate } from '@BE/core/utils/decorators/date';
import { GENDER } from '@BE/core/constants';
import { Transform } from 'class-transformer';
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

  @IsNotEmpty({ message: 'The citizen id is required' })
  @IsNumberString({}, { message: 'The citizen id must be number' })
  @ApiProperty({ example: '123456789102' })
  citizenId: string;

  @IsNotEmpty({ message: 'The department id is required' })
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @ApiProperty({ example: 1 })
  departmentId?: number;

  @IsNotEmpty({ message: 'The position id is required' })
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @ApiProperty({ example: 1 })
  positionId: number;

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
  @MinLength(10)
  @MaxLength(10)
  @ApiProperty({
    example: '0123456789',
  })
  phonenumber: string;

  @IsNotEmpty({ message: 'The password is required' })
  @IsString()
  @MinLength(8)
  @MaxLength(12)
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

export class GetProfileReqDto extends PartialType(
  OmitType(AddProfileReqDto, [
    'departmentId',
    'password',
    'roleId',
    'positionId',
  ] as const),
) {
  @ApiProperty({ example: 'Bakery' })
  department: string;

  @ApiProperty({ example: 'Cashier' })
  position: string;

  @ApiProperty({ example: 'Supervisor' })
  role: string;
}

export class UpdateProfileReqDto extends PartialType(
  OmitType(AddProfileReqDto, ['password'] as const),
) {}

export class GetProfilesReqDto extends PaginationReqDto {
  @IsOptional()
  @IsString({message: 'The search text must be a string'})
  searchText: string; 

  @IsOptional()
  @IsEnum(GENDER, {
    message: `The type of gender must be belonged to the enum ${Object.values(
      GENDER,
    )}`,
  })
  @ApiProperty({ enum: [GENDER.FEMALE, GENDER.MALE, GENDER.OTHER] })
  readonly gender?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'The department id must be a number' },
  )
  @ApiProperty({
    example: 1,
  })
  readonly departmentId?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'The role id must be a number' },
  )
  @ApiProperty({
    example: 1,
  })
  readonly roleId: number;
}

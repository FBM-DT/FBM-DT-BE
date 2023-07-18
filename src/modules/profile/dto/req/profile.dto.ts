import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  IsDate,
  IsPhoneNumber,
  Matches,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { DEPARTMENT, GENDER } from 'src/core/constants';
import { IsAfterStartDate } from './IsAfterStartDate';

export class AddProfileReqDto {
  @IsNotEmpty({ message: 'The full name is required' })
  @IsString({ message: 'The full name must be string type' })
  @ApiProperty({ example: 'Nguyen Van A' })
  fullname: string;

  @IsOptional()
  @IsDateString({}, { message: 'The date of birth must be date type' })
  @ApiProperty({
    example: '2021-01-01',
  })
  dateOfBirth?: Date;

  @IsOptional()
  @IsEnum(GENDER, {
    message: 'The type of gender must be belonged to the enum',
  })
  @ApiProperty({ enum: [...Object.values(GENDER)] })
  gender?: GENDER;

  @IsNotEmpty({ message: 'The phone number is required' })
  @IsOptional()
  @ApiProperty({ example: '15 Mai Thuc Lan' })
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
  @ApiProperty({ example: '2021-01-02' })
  endDate?: Date;

  @IsOptional()
  avatar?: string;
}

export class UpdateProfileReqDto extends PartialType(AddProfileReqDto) {}

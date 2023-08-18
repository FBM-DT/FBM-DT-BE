import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsMilitaryTime,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class AddDepartmentReqDto {
  @IsNotEmpty({ message: 'The full name is required' })
  @IsString({ message: 'The full name must be string type' })
  @ApiProperty({ example: 'Bakery' })
  name: string;

  @IsNotEmpty({ message: 'The phone number is required' })
  @IsOptional()
  @ApiProperty({ example: '15 Mai Thuc Lan', required: false })
  address?: string;

  @IsNotEmpty({ message: 'The email is required' })
  @IsMilitaryTime({
    message: 'The openAt must be in HH:MM format',
  })
  @ApiProperty({
    example: '08:00',
  })
  openAt: string;

  @IsNotEmpty({ message: 'The email is required' })
  @IsMilitaryTime({
    message: 'The closeAt must be in HH:MM format',
  })
  @ApiProperty({
    example: '15:00',
  })
  closeAt: string;
}

export class UpdateDepartmentReqDto extends PartialType(AddDepartmentReqDto) {}

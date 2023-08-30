import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Exclude, Transform, Type } from 'class-transformer';
import { WEEKDAYS } from '@BE/core/constants';
import { AddNoteReqDto } from '@BE/modules/note/dto/request';
import { AddTaskReqDto } from '@BE/modules/task/dto/request';
import { PaginationReqDto } from '@BE/core/shared/request';

class AddShift {
  @ApiProperty()
  @IsNotEmpty({ message: 'The work shift name is required' })
  @IsString({ message: 'The workshift name must be string type' })
  readonly name: string;

  @ApiProperty({ enum: WEEKDAYS, isArray: true })
  @IsNotEmpty({ message: 'The work shift type is required' })
  @IsArray({ message: 'The work shift type is an array' })
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { each: true, message: 'An element of repeat days array must be a number' },
  )
  readonly repeatDays: WEEKDAYS[];

  @ApiProperty()
  @IsNotEmpty({ message: 'The start time must be required' })
  @IsString({ message: 'The start time must be a string' })
  startTime: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The end time must be required' })
  @IsString({ message: 'The end time must be a string' })
  endTime: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'The department must be required',
  })
  @IsInt({ message: 'The department id must be a number' })
  @Type(() => Number)
  departmentId: number;
}
export class AddShiftReqDto {
  @ApiProperty({ required: false, type: AddShift })
  @ValidateNested()
  @Type(() => AddShift)
  shift?: AddShift;

  @ApiProperty({ required: false, type: () => AddTaskReqDto, isArray: true })
  @ValidateNested({ each: true })
  @Type(() => AddTaskReqDto)
  task?: Array<AddTaskReqDto> = [];

  @ApiProperty({ required: false, type: () => AddNoteReqDto, isArray: true })
  @ValidateNested({ each: true })
  @Type(() => AddNoteReqDto)
  note?: Array<AddNoteReqDto> = [];
}

export class GetShiftListReqDto extends PaginationReqDto {
  @IsOptional()
  @IsString({ message: 'The search text must be a string' })
  searchText: string;

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
}

export class UpdateShiftReqDto extends OmitType(AddShift, ['departmentId']) {
  @Exclude()
  departmentId?: number;
}

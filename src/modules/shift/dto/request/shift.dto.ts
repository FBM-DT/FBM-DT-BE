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
import { WEEKDAYS } from '../../../../core/constants';
import { PaginationReqDto } from '../../../../core/shared/request';
import { AddTaskReqDto } from '../../../task/dto/request';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { AddNoteReqDto } from '../../../../modules/note/dto/request';

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
  task?: Array<AddTaskReqDto>;

  @ApiProperty({ required: false, type: () => AddNoteReqDto, isArray: true })
  @ValidateNested({ each: true })
  @Type(() => AddNoteReqDto)
  note?: Array<AddNoteReqDto>;
}

export class GetShiftListReqDto extends PaginationReqDto {
  @IsOptional()
  @IsString({ message: 'The sort must be a string' })
  readonly sort?: string;

  @IsOptional()
  @IsString({ message: 'The type must be a string' })
  readonly type?: string;

  @IsOptional()
  @IsString({ message: 'The address must be a string' })
  readonly address?: string;

  @IsOptional()
  @IsString({ message: 'The name must be a string' })
  readonly name?: string;

  @IsOptional()
  @IsString({ message: 'The position must be a string' })
  readonly position?: string;
}

export class UpdateShiftReqDto extends OmitType(AddShift, ['departmentId']) {
  @Exclude()
  departmentId?: number;
}

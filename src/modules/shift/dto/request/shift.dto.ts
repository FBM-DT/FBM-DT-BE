import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { WEEKDAYS, WORKTYPE } from '../../../../core/constants';
import { PaginationReqDto } from '../../../../core/shared/request';
import {
  AddTaskNoteReqDto,
  AddTaskReqDto,
} from '../../../task/dto/request';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class AddWorkShift {
  @IsNotEmpty({ message: 'The work shift name is required' })
  @IsString({ message: 'The workshift name must be string type' })
  readonly name: string;

  @IsNotEmpty({ message: 'The work shift type is required' })
  @IsArray({ message: 'The work shift type is an array' })
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  readonly repeatDays: Array<WEEKDAYS>;

  @IsNotEmpty({ message: 'The start time must be required' })
  @IsString({ message: 'The start time must be a string' })
  startTime: string;

  @IsNotEmpty({ message: 'The end time must be required' })
  @IsString({ message: 'The end time must be a string' })
  endTime: string;

  @IsNotEmpty({
    message: 'The department must be required',
  })
  @IsInt({ message: 'The department id must be a number' })
  @Type(() => Number)
  departmentId: number;
}
class AddTaskInfor extends AddTaskReqDto {
  @ApiProperty({ required: false, type: () => AddTaskNoteReqDto })
  taskNote?: Array<AddTaskNoteReqDto>;
}
export class AddWorkShiftReqDto {
  @ApiProperty({ required: false, type: AddWorkShift })
  workShift?: AddWorkShift;

  @ApiProperty({ required: false, type: () => AddTaskInfor })
  task?: Array<AddTaskInfor>;
}

export class GetWorkShiftListReqDto extends PaginationReqDto {
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

export class UpdateWorkShiftReqDto {
  @IsOptional()
  @IsString({ message: 'The workshift name must be string type' })
  readonly name?: string;

  @IsOptional()
  @IsEnum(WORKTYPE, {
    message: 'The type of work shift must be belonged to the enum',
  })
  readonly type?: WORKTYPE;

  @IsOptional()
  @IsString({ message: 'The work shift address must be string type' })
  readonly address?: string;

  @IsOptional()
  @IsString({ message: 'The work shift duration must be string type' })
  readonly duration?: string;

  @IsOptional()
  @IsString({ message: 'The work shift description must be string type' })
  readonly description?: string;
}

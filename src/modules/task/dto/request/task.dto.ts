import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationReqDto } from '../../../../core/shared/request';
import { ApiProperty } from '@nestjs/swagger';
import { TASKSTATUS } from '../../../../core/constants';

export class AddTaskReqDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'The task name cannot be empty' })
  @IsString({ message: 'The task name must be a string' })
  name: string;

  @ApiProperty({
    enum: TASKSTATUS,
  })
  @IsNotEmpty({ message: 'The task status cannot be empty' })
  @IsEnum(TASKSTATUS, {
    message: 'The type of work shift must be belonged to the enum',
  })
  status: TASKSTATUS;

  @IsEmpty({
    message: 'The shift id cannot be passed into the request body',
  })
  @Transform(({ value }) => parseInt(value))
  shiftId: number;
}

export class UpdateTaskReqDto {
  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'The task name must be a string' })
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(TASKSTATUS, {
    message: 'The type of work shift must be belonged to the enum',
  })
  status: TASKSTATUS;
}

export class GetTaskListReqDto extends PaginationReqDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'The sort must be a string' })
  readonly sort?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'The name must be a string' })
  readonly name?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      if (value.toLowerCase() === 'true') {
        return true;
      }
      if (value.toLowerCase() === 'false') {
        return false;
      }
    }
    return value;
  })
  @IsBoolean({ message: 'The task status must be in boolean type' })
  readonly status?: boolean;
}

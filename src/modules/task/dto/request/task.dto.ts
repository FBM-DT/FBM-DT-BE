import { Expose, Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PaginationReqDto } from '../../../../core/shared/request';
import { ApiProperty } from '@nestjs/swagger';

export class AddTaskReqDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'The task name cannot be empty' })
  @IsString({ message: 'The task name must be a string' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The task status cannot be empty' })
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
  status: boolean;

  @IsEmpty({
    message: 'The workshift id cannot be passed into the request body',
  })
  @Transform(({ value }) => parseInt(value))
  workShiftId: number;
}

export class UpdateTaskReqDto {
  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'The task name must be a string' })
  name?: string;

  @ApiProperty()
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
  status?: boolean;
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

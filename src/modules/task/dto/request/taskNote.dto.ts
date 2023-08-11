import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PaginationReqDto } from '../../../../core/shared/request';

export class AddTaskNoteReqDto {
  @IsNotEmpty({ message: 'The task note context cannot be empty' })
  @IsString({ message: 'The task note context must be a string' })
  context: string;

  @IsNotEmpty({ message: 'The account id cannot be empty' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return Number(value.toLowerCase());
    }
    return value;
  })
  @IsNumber()
  accountId: number;

  @IsEmpty({ message: 'The task id cannot be passed into the request body' })
  @Transform(({ value }) => {
    parseInt(value.toLowerCase());
  })
  taskId: number;
}

export class UpdateTaskNoteReqDto {
  @IsOptional()
  @IsString({ message: 'The task note context must be a string' })
  context?: string;
}

export class GetTaskNoteListReqDto extends PaginationReqDto {
  @IsOptional()
  @IsString({ message: 'The sort must be a string' })
  readonly sort?: string;

  @IsOptional()
  @IsString({ message: 'The task note context must be a string' })
  context?: string;
}

import { Transform, Type } from 'class-transformer';
import {
  IsEmpty,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationReqDto } from '../../../../core/shared/request';
import { ApiProperty } from '@nestjs/swagger';

export class AddNoteReqDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'The task note context cannot be empty' })
  @IsString({ message: 'The task note context must be a string' })
  context: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The account id cannot be empty' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return Number(value.toLowerCase());
    }
    return value;
  })
  @IsInt({
    message: 'The note must contain the id of the owner',
  })
  createdBy: number;

  @IsEmpty({
    message: 'The shift id cannot be passed into the request body',
  })
  @Transform(({ value }) => parseInt(value))
  shiftId: number;
}

export class UpdateNoteReqDto {
  @IsOptional()
  @IsString({ message: 'The task note context must be a string' })
  context?: string;
}

export class GetNoteListReqDto extends PaginationReqDto {
  @IsOptional()
  @IsString({ message: 'The sort must be a string' })
  readonly sort?: string;

  @IsOptional()
  @IsString({ message: 'The task note context must be a string' })
  context?: string;
}

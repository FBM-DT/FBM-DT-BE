import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { AppResponse } from '../app.response';
import { ErrorHandler } from '../common/error';

export class PaginationReqDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'The page must be a number' })
  @Min(0)
  readonly page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'The size of a page must be a number' })
  @Min(0)
  readonly pageSize?: number = 10;

  @IsOptional()
  @IsString({ message: 'The sort by must be a string' })
  readonly sortBy?: string;

  @IsOptional()
  @IsString({ message: 'The sort value must be a string' })
  @Transform(({ value }) => value.toUpperCase())
  @IsIn(['ASC', 'DESC'], {
    message: `orderInValid:${ErrorHandler.invalid('Order value')}`,
  })
  readonly order?: string = 'ASC';
}

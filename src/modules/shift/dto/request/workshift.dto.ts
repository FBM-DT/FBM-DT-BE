import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { WORKTYPE } from '../../../../core/constants';
import { PaginationRequestDto } from '../../../../core/shared/pagination.request.dto';

export class AddWorkShiftRequestDto {
  @IsNotEmpty({ message: 'The work shift name is required' })
  @IsString({ message: 'The workshift name must be string type' })
  readonly name: string;

  @IsNotEmpty({ message: 'The work shift type is required' })
  @IsEnum(WORKTYPE, {
    message: 'The type of work shift must be belonged to the enum',
  })
  readonly type: WORKTYPE;

  @IsNotEmpty({ message: 'The work shift address is required' })
  @IsString({ message: 'The work shift address must be string type' })
  readonly address: string;

  @IsNotEmpty({ message: 'The work shift duration is required' })
  @IsString({ message: 'The work shift duration must be string type' })
  readonly duration: string;

  @IsOptional()
  @IsString({ message: 'The work shift description must be string type' })
  readonly description: string;
}

export class GetWorkShiftListRequestDto extends PaginationRequestDto {
  @IsOptional()
  @IsString({ message: 'The sort option must be a string' })
  readonly sortBy?: string;

  @IsOptional()
  @IsString({ message: 'The sort value must be a string' })
  readonly sortValue?: string;

  @IsOptional()
  @IsString({ message: 'The type must be a string' })
  readonly type?: string;

  @IsOptional()
  @IsString({ message: 'The address must be a string' })
  readonly address?: string;

  @IsOptional()
  @IsString({ message: 'The position must be a string' })
  readonly position?: string;
}

export class UpdateWorkShiftRequestDto {
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

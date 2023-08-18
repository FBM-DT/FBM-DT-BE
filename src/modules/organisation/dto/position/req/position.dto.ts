import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePositionReqDto {
  @IsNotEmpty({ message: 'The name position is required' })
  @IsString({ message: 'The name position must be string type' })
  @ApiProperty()
  readonly name: string;
}

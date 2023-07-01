import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsString, IsNotEmpty } from 'class-validator';

export class CreateInventoryRequestDto {
  @IsString({ message: 'The name must be string type' })
  @IsNotEmpty({ message: 'The name is required' })
  @ApiProperty({
    default: 'Inventory',
  })
  name: string;

  @IsInt({ message: 'The quantity must be a number' })
  @IsNotEmpty({ message: 'The quantity is required' })
  @ApiProperty()
  quantity: number;

  @IsInt({ message: 'The updateBy by must be a number' })
  @IsNotEmpty({ message: 'The updateBy is required' })
  @ApiProperty()
  updateBy: number;

  @ApiProperty({
    default: false,
  })
  isDeleted: boolean;
}

export class UpdateInventoryRequestDto extends PartialType(
  CreateInventoryRequestDto,
) {}

import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsString, IsNotEmpty } from 'class-validator';

export class CreateInventoryRequestDto {
  @IsNotEmpty({ message: 'The name is required' })
  @IsString({ message: 'The name must be string type' })
  @ApiProperty({
    default: 'Inventory',
  })
  name: string;

  @IsNotEmpty({ message: 'The quantity is required' })
  @IsInt({ message: 'The quantity must be a number' })
  @ApiProperty()
  quantity: number;

  @IsNotEmpty({ message: 'The updateBy is required' })
  @IsInt({ message: 'The updateBy by must be a number' })
  @ApiProperty()
  updateBy: number;

  isDeleted: boolean;
}

export class UpdateInventoryRequestDto extends PartialType(
  CreateInventoryRequestDto,
) {}

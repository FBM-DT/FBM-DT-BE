import { IsInt } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { ShareEntity } from '../../../core/shared';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Inventory extends ShareEntity {
  @ApiProperty()
  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @ApiProperty()
  @Column({
    type: 'int',
    nullable: false,
  })
  quantity: number;

  @ApiProperty()
  @Column({
    type: 'int',
    nullable: false,
  })
  updateBy: number;

  @ApiProperty({
    default: false,
    required: false,
  })
  @Column({
    type: 'boolean',
    default: false,
    nullable: false,
  })
  isDeleted: boolean;
}

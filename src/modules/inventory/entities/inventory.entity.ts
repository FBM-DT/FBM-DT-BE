import { IsInt } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { ShareEntity } from '../../../core/shared';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Inventory extends ShareEntity {
  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  quantity: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  updateBy: number;

  @Column({
    type: 'boolean',
    default: false,
    nullable: false,
  })
  isDeleted: boolean;
}

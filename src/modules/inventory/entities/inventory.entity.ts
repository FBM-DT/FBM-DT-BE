import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ShareEntity } from '@BE/core/shared';
import { Account } from '@BE/modules/auth/account.entity';

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
    nullable: true,
  })
  updateBy: number;

  @ManyToOne(() => Account, (account) => account.inventories, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'updateBy', referencedColumnName: 'id' })
  account: Account;

  @Column({
    type: 'boolean',
    default: false,
  })
  isDeleted: boolean;
}

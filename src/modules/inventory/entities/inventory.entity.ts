import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ShareEntity } from '../../../core/shared';
import { Account } from '../../auth/account.entity';

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

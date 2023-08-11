import { Account } from '../auth/account.entity';
import { ShareEntity } from '../../core/shared';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Shift } from '../shift/entities/shift.entity';

@Entity()
export class Note extends ShareEntity {
  @Column({
    type: 'varchar',
    length: 500,
    nullable: false,
  })
  context: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  createdBy: number;
  @ManyToOne(() => Account, (account) => account.notes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'createdBy', referencedColumnName: 'id' })
  account: Account;

  @Column({
    type: 'int',
    nullable: false,
  })
  shiftId: number;
  @ManyToOne(() => Shift, (shift) => shift.notes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'shiftId', referencedColumnName: 'id' })
  shift: Shift;
}

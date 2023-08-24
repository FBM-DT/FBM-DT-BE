import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Shift } from './shift.entity';
import { ShareEntity } from '@BE/core/shared';
import { Account } from '@BE/modules/auth/account.entity';

@Entity({
  name: 'schedule',
})
export class Schedule extends ShareEntity {
  @Column({
    type: 'date',
    nullable: false,
  })
  startDate: Date;

  @Column({
    type: 'int',
    nullable: false,
  })
  shiftId: number;
  @ManyToOne(() => Shift, (shift) => shift.schedules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shiftId', referencedColumnName: 'id' })
  shift: Shift;

  @Column({
    type: 'int',
    nullable: false,
  })
  accountId: number;
  @ManyToOne(() => Account, (account) => account.schedules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'accountId', referencedColumnName: 'id' })
  account: Account;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  isAccept: boolean;

  @Column({
    type: 'int',
    nullable: false,
  })
  updatedBy: number;

  @Column({
    type: 'varchar',
    length: 5,
    nullable: true,
  })
  checkIn: string;

  @Column({
    type: 'varchar',
    length: 5,
    nullable: true,
  })
  checkOut: string;

  @Column({
    type: 'boolean',
    nullable: true,
  })
  isLate: boolean;
}

import { ShareEntity } from '../../core/shared';
import { Column, Entity, OneToMany } from 'typeorm';
import { StaffShift } from '../shift/entities/staffInShift.entity';
import { Position } from '../position/position.entity';
import { Account } from '../auth/account.entity';

@Entity()
export class User extends ShareEntity {
  @Column({
    type: 'varchar',
    length: 500,
    nullable: false,
  })
  fullname: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  dateOfBirth: Date;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 500,
  })
  avatar: string;

  @OneToMany(()=>StaffShift, (staffShift)=>staffShift.userId)
  staffShifts: StaffShift[];

  @OneToMany(()=>Position, (position) => position.id)
  positions: Position[];

  @OneToMany(() => Account, (account)=>account.userId)
  accounts: Account[];
}

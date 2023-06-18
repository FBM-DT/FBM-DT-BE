import { ShareEntity } from '../../core/shared';
import { Column, Entity, OneToMany } from 'typeorm';
import { Staff_Shift } from '../shift/entities/staffInShift.entity';
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

  @OneToMany(()=>Staff_Shift, (staffShift)=>staffShift.userId)
  staffShifts: Staff_Shift[];

  @OneToMany(()=>Position, (position) => position.id)
  positions: Position[];

  @OneToMany(() => Account, (account)=>account.userId)
  accounts: Account[];
}

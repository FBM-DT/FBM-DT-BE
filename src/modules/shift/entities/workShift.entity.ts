import { WORKTYPE } from '../../../core/constants';
import { ShareEntity } from '../../../core/shared';
import { Column, Entity, OneToMany } from 'typeorm';
import { StaffShift } from './staffInShift.entity';
import { Task } from '../../task/entities/task.entity';

@Entity()
export class WorkShift extends ShareEntity {
  @Column({
    type: 'varchar',
    length: 1000,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'enum',
    enum: WORKTYPE,
    default: WORKTYPE.DAILY,
  })
  type: WORKTYPE;

  @Column({
    type: 'varchar',
    length: 1000,
    nullable: false,
  })
  address: string;

  @Column({
    type: 'varchar',
    length: 1000,
    nullable: false,
  })
  duration: string;

  @Column({
    type: 'varchar',
    length: 1000,
    nullable: true,
  })
  description: string;

  @OneToMany(() => StaffShift, (staffShift) => staffShift.workShiftId)
  staffShifts: StaffShift[];
  @OneToMany(() => Task, (task) => task.workShiftId)
  tasks: Task;
}

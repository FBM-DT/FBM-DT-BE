import { WEEKDAYS } from '../../../core/constants';
import { ShareEntity } from '../../../core/shared';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Schedule } from './schedule.entity';
import { Task } from '../../task/entities/task.entity';
import { Department } from '../../../modules/organisation/entities/department.entity';
import { Note } from '../../../modules/note/note.entity';

@Entity({
  name: 'shift',
})
export class Shift extends ShareEntity {
  @Column({
    type: 'varchar',
    length: 1000,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'int',
    array: true,
    nullable: false,
  })
  repeatDays: Array<WEEKDAYS>;

  @Column({
    type: 'int',
    nullable: false,
  })
  departmentId: number;
  @ManyToOne(() => Department, (department) => department.shifts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'departmentId',
    referencedColumnName: 'id',
  })
  department: Department;

  @Column({
    type: 'varchar',
    length: 5,
    nullable: false,
  })
  startTime: string;

  @Column({
    type: 'varchar',
    length: 5,
    nullable: false,
  })
  endTime: string;

  @OneToMany(() => Schedule, (schedule) => schedule.shift)
  schedules: Schedule[];
  
  @OneToMany(() => Task, (task) => task.shift)
  tasks: Task[];

  @OneToMany(() => Note, (note) => note.shift)
  notes: Note[];
}

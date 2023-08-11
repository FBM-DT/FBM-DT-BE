import { ShareEntity } from '../../../core/shared';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Shift } from '../../shift/entities/shift.entity';
import { TASKSTATUS } from '../../../core/constants';

@Entity({
  name: 'task',
})
export class Task extends ShareEntity {
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'enum',
    enum: TASKSTATUS,
    default: TASKSTATUS.TODO,
    nullable: false,
  })
  status: TASKSTATUS;

  @Column({
    type: 'int',
    nullable: false,
  })
  shiftId: number;
  @ManyToOne(() => Shift, (shift) => shift.tasks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'shiftId', referencedColumnName: 'id' })
  shift: Shift;
}

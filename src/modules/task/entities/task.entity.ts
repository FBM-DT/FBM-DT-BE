import { ShareEntity } from '../../../core/shared';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { WorkShift } from '../../shift/entities/workShift.entity';

@Entity()
export class Task extends ShareEntity {
  @Column({
    type: 'varchar',
    length: 1000,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'boolean',
    default: true,
    nullable: false,
  })
  status: boolean;

  @Column({
    type: 'int',
    nullable: false,
  })
  workShiftId: number;

  @ManyToOne(() => WorkShift, (ws) => ws.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workShiftId' })
  workShift: WorkShift;
}

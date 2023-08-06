import { Account } from '../../../modules/auth/account.entity';
import { ShareEntity } from '../../../core/shared';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Task } from './task.entity';

@Entity()
export class TaskNote extends ShareEntity {
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
  accountId: number;
  @ManyToOne(() => Account, (account) => account.taskNotes, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @Column({
    type: 'int',
    nullable: false,
  })
  taskId: number;
  @ManyToOne(() => Task, (task) => task.taskNotes, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'taskId', referencedColumnName: 'id' })
  task: Task;
}

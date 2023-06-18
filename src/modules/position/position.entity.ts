import { ShareEntity } from '../../core/shared';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Position extends ShareEntity {
  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
    length: 5000,
  })
  name: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  userId: number;

  @ManyToOne(() => User, (user) => user.positions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  users: User;
}

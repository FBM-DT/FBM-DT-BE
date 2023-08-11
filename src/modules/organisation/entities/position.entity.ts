import { ShareEntity } from '../../../core/shared';
import { Column, Entity, OneToMany } from 'typeorm';
import { User } from '../../users/user.entity';

@Entity({
  name: 'position',
})
export class Position extends ShareEntity {
  @Column({
    type: 'varchar',
    nullable: false,
    length: 255,
  })
  name: string;

  @OneToMany(() => User, (user) => user.position)
  users: User[];
}
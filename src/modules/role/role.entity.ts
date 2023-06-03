import { ShareEntity } from '../../core/shared';
import { Column, Entity, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Role extends ShareEntity {
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  name: string;
  @OneToMany(() => User, (user) => user.id)
  users: User[];
}

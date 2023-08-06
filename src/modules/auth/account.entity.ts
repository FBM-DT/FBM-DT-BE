import { ShareEntity } from '../../core/shared';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Role } from '../role/role.entity';
import { User } from '../users/user.entity';
import { TaskNote } from '../task/entities/tasknote.entity';

@Entity()
export class Account extends ShareEntity {
  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
    unique: true,
  })
  phonenumber: string;

  @Column({
    type: 'varchar',
    length: 5000,
    nullable: false,
  })
  password: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  refreshToken: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isValidOtp: boolean;

  @Column({
    type: 'int',
    nullable: false,
    unique: false,
  })
  roleId: number;
  @ManyToOne(() => Role, (role) => role.account, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Column({
    type: 'int',
    nullable: false,
  })
  userId: number;
  @ManyToOne(() => User, (user) => user.accounts, {
    onDelete: 'CASCADE',
    onUpdate: 'SET NULL',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => TaskNote, (taskNote) => taskNote.accountId)
  taskNotes: TaskNote[];
}

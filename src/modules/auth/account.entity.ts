import { ShareEntity } from '../../core/shared';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Role } from '@BE/modules/role/role.entity';
import { Note } from '@BE/modules/note/note.entity';
import { Schedule } from '@BE/modules/shift/entities/schedule.entity';
import { Inventory } from '@BE/modules/inventory/entities/inventory.entity';
import { User } from '@BE/modules/users/user.entity';

@Entity({
  name: 'account',
})
export class Account extends ShareEntity {
  @Column({
    type: 'varchar',
    length: 10,
    nullable: false,
    unique: true,
  })
  phonenumber: string;

  @Column({
    type: 'varchar',
    length: 500,
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
    nullable: false,
    default: true,
  })
  isActive: boolean;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  isValidOtp: boolean;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  firstLogin: boolean;

  @Column({
    type: 'int',
    nullable: false,
  })
  userId: number;
  @ManyToOne(() => User, (user) => user.accounts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @Column({
    type: 'int',
    nullable: false,
  })
  roleId: number;
  @ManyToOne(() => Role, (role) => role.accounts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId', referencedColumnName: 'roleId' })
  role: Role;

  @OneToMany(() => Note, (note) => note.account)
  notes: Note[];

  @OneToMany(() => Schedule, (schedule) => schedule.account)
  schedules: Schedule[];

  @OneToMany(() => Inventory, (inventory) => inventory.account)
  inventories: Inventory[];
}

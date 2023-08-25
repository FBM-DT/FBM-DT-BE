import { User } from '@BE/modules/users/user.entity';
import { ShareEntity } from '@BE/core/shared';
import { Column, Entity, OneToMany } from 'typeorm';
import { Shift } from '@BE/modules/shift/entities/shift.entity';

@Entity({
  name: 'department',
})
export class Department extends ShareEntity {
  @Column({
    type: 'varchar',
    nullable: false,
    length: 255,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  address: string;

  @Column({
    type: 'varchar',
    length: 5,
    nullable: false,
  })
  openAt: string;

  @Column({
    type: 'varchar',
    length: 5,
    nullable: false,
  })
  closeAt: string;

  @Column({
    type: 'boolean',
    nullable: false,
    default: true,
  })
  isActive: boolean;

  @OneToMany(() => User, (user) => user.department)
  users: User[];

  @OneToMany(() => Shift, (shift) => shift.department)
  shifts: Shift[];
}

import { ShareEntity } from '@BE/core/shared';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Position } from '@BE/modules/organisation/entities/position.entity';
import { Account } from '@BE/modules/auth/account.entity';
import { GENDER } from '@BE/core/constants';
import { Department } from '@BE/modules/organisation/entities/department.entity';

@Entity({
  name: 'user',
})
export class User extends ShareEntity {
  @Column({
    type: 'varchar',
    length: 500,
    nullable: false,
  })
  fullname: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: false,
  })
  address: string;

  @Column({
    type: 'enum',
    enum: GENDER,
    default: GENDER.MALE,
  })
  gender: GENDER;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 500,
  })
  avatar: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  dateOfBirth: Date;

  @Column({
    type: 'date',
    nullable: false,
  })
  startDate: Date;

  @Column({
    type: 'date',
    nullable: true,
  })
  endDate: Date;

  @Column({
    type: 'boolean',
    nullable: false,
    default: true,
  })
  isActive: boolean;

  @Column({
    type: 'varchar',
    length: 12,
    nullable: false,
  })
  citizenId: string;

  @Column({
    type: 'varchar',
    length: 15,
    nullable: true,
  })
  socialInsurance: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  positionId: number;
  @ManyToOne(() => Position, (position) => position.users, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'positionId', referencedColumnName: 'id' })
  position: Position;

  @Column({
    type: 'int',
    nullable: false,
  })
  departmentId: number;
  @ManyToOne(() => Department, (department) => department.users, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'departmentId', referencedColumnName: 'id' })
  department: Department;

  @OneToMany(() => Account, (account) => account.user)
  accounts: Account[];
}

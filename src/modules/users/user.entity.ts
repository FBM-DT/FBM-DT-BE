import { ShareEntity } from '../../core/shared';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Role } from '../role/role.entity';
import { Staff_Shift } from '../shift/entities/staffInShift.entity';

@Entity()
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
    length: 5000,
    nullable: false,
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
    unique: true,
  })
  phonenumber: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  dateOfBirth: Date;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 500,
  })
  avatar: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  roleId: number;
  @ManyToOne(() => Role, (role) => role.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @OneToMany(()=>Staff_Shift, (staffShift)=>staffShift.staffId)
  staffShifts: Staff_Shift[]
}

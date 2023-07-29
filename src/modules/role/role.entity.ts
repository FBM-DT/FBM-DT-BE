import { ShareEntity } from '../../core/shared';
import { Column, Entity, OneToMany } from 'typeorm';
import { Account } from '../auth/account.entity';
import { ACCOUNT_ROLE } from '../../core/constants';

@Entity()
export class Role extends ShareEntity {
  @Column({
    type: 'enum',
    enum: ACCOUNT_ROLE,
    default: ACCOUNT_ROLE.USER,
    unique: true,
  })
  name: ACCOUNT_ROLE;

  @OneToMany(() => Account, (account) => account.id)
  account: Account;
}

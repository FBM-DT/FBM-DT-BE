import { ShareEntity } from '../../core/shared';
import { Column, Entity, OneToOne } from 'typeorm';
import { Account } from '../auth/account.entity';
import { ACCOUNT_ROLE } from '../../core/constants';
import { User } from '../users/user.entity';

@Entity()
export class Role extends ShareEntity {
  @Column({
    type: 'enum',
    enum: ACCOUNT_ROLE,
    default: ACCOUNT_ROLE.USER,
    unique: true,
  })
  name: ACCOUNT_ROLE;

  @OneToOne(() => Account, (account) => account.id)
  account: Account;
}

import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { CONNECTION } from './core/constants';
import { Repository, DataSource } from 'typeorm';
import { roleData, userData } from './db/masterData';
import { Role } from './modules/role/role.entity';
import { User } from './modules/users/user.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private roleRepository: Repository<Role>;
  private userRepository: Repository<User>;
  constructor(
    @Inject(CONNECTION)
    dataSource: DataSource,
  ) {
    this.roleRepository = dataSource.getRepository(Role);
    this.userRepository = dataSource.getRepository(User);
  }

  async onModuleInit() {
    this.seedRoleData();
    this.seedUserData();
  }

  async seedRoleData() {
    const role = await this.roleRepository.find();
    if (!role || role.length < 1) {
      await this.roleRepository
        .createQueryBuilder()
        .insert()
        .into(Role)
        .values(roleData)
        .execute();
    }
  }

  async seedUserData() {
    const role = await this.userRepository.find();
    if (!role || role.length < 1) {
      await this.userRepository
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(userData)
        .execute();
    }
  }
}

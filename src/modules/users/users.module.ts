import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRepository } from './users.provider';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/db/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
})
export class UsersModule {}

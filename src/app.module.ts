import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RoleModule } from './modules/role/role.module';
import { DatabaseModule } from './db/database.module';
import { ShiftModule } from './modules/shift/shift.module';
import { TaskModule } from './modules/task/task.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { ProfileModule } from './modules/profile/profile.module';
import { OrganisationModule } from './modules/organisation/organisation.module';
import { NoteModule } from './modules/note/note.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    RoleModule,
    ShiftModule,
    TaskModule,
    InventoryModule,
    ProfileModule,
    OrganisationModule,
    NoteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

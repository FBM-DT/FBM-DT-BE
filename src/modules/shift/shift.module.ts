import { Module } from '@nestjs/common';
import { ShiftController } from './shift.controller';
import { ShiftService } from './shift.service';
import { ShiftRepository } from './shift.provider';
import { DatabaseModule } from '../../db/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ShiftController],
  providers: [ShiftService, ShiftRepository],
  exports: [ShiftService, ShiftRepository]
})
export class ShiftModule {}

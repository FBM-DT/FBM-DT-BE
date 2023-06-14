import { Module } from '@nestjs/common';
import { ShiftController } from './shift.controller';
import { ShiftService } from './shift.service';
import { DatabaseModule } from '../../db/database.module';

@Module({
  controllers: [ShiftController],
  providers: [ShiftService],
  exports: [ShiftService]
})
export class ShiftModule {}

import { Module } from '@nestjs/common';
import { ShiftController } from './shift.controller';
import { ShiftService } from './shift.service';
import { DatabaseModule } from '../../db/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkShift } from './entities/work-shift.entity';

@Module({
  imports: [DatabaseModule],
  controllers: [ShiftController],
  providers: [ShiftService],
  exports: [ShiftService]
})
export class ShiftModule {}

import { Module } from '@nestjs/common';
import { DepartmentController, PositionController } from './controllers';
import { DepartmentService, PositionService } from './services/';

@Module({
  controllers: [DepartmentController, PositionController],
  providers: [DepartmentService, PositionService],
})
export class OrganisationModule {}

import { Module } from '@nestjs/common';
import { DepartmentController } from './controllers/department.controller';
import { DepartmentService } from './services/department.service';

@Module({
  controllers: [DepartmentController],
  providers: [DepartmentService]
})
export class OrganisationModule {}

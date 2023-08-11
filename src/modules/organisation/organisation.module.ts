import { Module } from '@nestjs/common';
import { DepartmentController } from './controllers/department.controller';
import { DepartmentServiceTsService } from './services/department.service';

@Module({
  controllers: [DepartmentController],
  providers: [DepartmentServiceTsService]
})
export class OrganisationModule {}

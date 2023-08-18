import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentService } from './department.service';
import { DatabaseModule } from '../../../../src/db/database.module';
import { ConfigModule } from '@nestjs/config';
import { Department } from '../entities/department.entity';

describe('DepartmentServiceTsService', () => {
  let service: DepartmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
        Department,
        DatabaseModule,
      ],
      providers: [DepartmentService],
    }).compile();

    service = module.get<DepartmentService>(DepartmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

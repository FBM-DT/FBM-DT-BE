import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentServiceTsService } from './department.service';

describe('DepartmentServiceTsService', () => {
  let service: DepartmentServiceTsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DepartmentServiceTsService],
    }).compile();

    service = module.get<DepartmentServiceTsService>(DepartmentServiceTsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

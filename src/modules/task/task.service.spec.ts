import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TaskService } from './task.service';
import { TaskModule } from './task.module';
import { DatabaseModule } from '../../db/database.module';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
        TaskModule,
        DatabaseModule,
      ],
      providers: [TaskService],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

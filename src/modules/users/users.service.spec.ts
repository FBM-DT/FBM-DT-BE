import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersModule } from './users.module';
import { DatabaseModule } from '../../db/database.module';
import { ConfigModule } from '@nestjs/config';

describe('UsersService', () => {
  let service: UsersService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        UsersModule,
        DatabaseModule,
        ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

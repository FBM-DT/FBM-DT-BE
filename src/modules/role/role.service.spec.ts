import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { DatabaseModule } from '../../../src/db/database.module';
import { RoleModule } from './role.module';
import { RoleService } from './role.service';

describe('RoleService', () => {
  let roleService: RoleService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, RoleModule],
      providers: [RoleService],
    }).compile();

    roleService = moduleRef.get<RoleService>(RoleService);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe('getRole', () => {
    it('RoleService should be defined', () => {
      expect(roleService).toBeDefined();
    });

    it('should return list role', async () => {
      const expectedResponse = {
        message: 'Success',
        status: 200,
        data: [
          {
            id: 1,
            name: 'admin',
            roleId: 1,
          },
          {
            id: 2,
            name: 'supervisor',
            roleId: 2,
          },
          {
            id: 3,
            name: 'user',
            roleId: 3,
          },
        ],
        version: 'v1',
      };
      jest
        .spyOn(roleService, 'getAll')
        .mockImplementation(async () => expectedResponse);
      expect(await roleService.getAll()).toBe(expectedResponse);
    });
  });
});

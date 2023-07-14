import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { InventoryModule } from './inventory.module';
import { DatabaseModule } from '../../../src/db/database.module';
import {
  AddInventoryResDto,
  GetAllInventoryResDto,
  GetInventoryResDto,
  UpdateInventoryResDto,
} from './dto/response';
import { CreateInventoryReqDto, UpdateInventoryReqDto } from './dto/request';
import { ConfigModule } from '@nestjs/config';

describe('InventoryService', () => {
  let service: InventoryService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
        InventoryModule,
        DatabaseModule,
      ],
      providers: [InventoryService],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
  });

  describe('Create new inventory', () => {
    it('should be created', async () => {
      const result: AddInventoryResDto = new AddInventoryResDto();
      result.data = 1;
      result.message = 'Success';
      result.version = 'v1';
      result.status = 201;

      const dto: CreateInventoryReqDto = {
        name: 'test',
        quantity: 1,
        updateBy: 1,
        isDeleted: false,
      };
      jest
        .spyOn(service, 'createInventory')
        .mockImplementation(async () => result);
      expect(await service.createInventory(dto)).toEqual({
        message: 'Success',
        status: 201,
        data: 1,
        version: 'v1',
      });
    });
  });
  describe('Get all inventory', () => {
    it('should be get all inventory', async () => {
      const mockInventories: any[] = [
        { id: 1, name: 'Inventory 1', quantity: 1, isDeleted: false },
        { id: 2, name: 'Inventory 2', quantity: 2, isDeleted: false },
      ];
      const result: GetAllInventoryResDto = new GetAllInventoryResDto();
      result.data = mockInventories;
      result.message = 'Success';
      result.version = 'v1';
      result.status = 200;

      jest
        .spyOn(service, 'getAllInventories')
        .mockImplementation(async () => result);
      expect(await service.getAllInventories()).toEqual({
        message: 'Success',
        status: 200,
        data: mockInventories,
        version: 'v1',
      });
    });
  });
  describe('Get inventory by id', () => {
    it('should be get inventory by id', async () => {
      const mockInventory: any = {
        id: 1,
        name: 'Inventory 1',
        quantity: 1,
        isDeleted: false,
      };
      const result: GetInventoryResDto = new GetInventoryResDto();
      result.data = mockInventory;
      result.message = 'Success';
      result.version = 'v1';
      result.status = 200;

      jest
        .spyOn(service, 'getInventoryById')
        .mockImplementation(async () => result);
      expect(await service.getInventoryById(1)).toEqual({
        message: 'Success',
        status: 200,
        data: mockInventory,
        version: 'v1',
      });
    });
  });
  describe('Update inventory', () => {
    it('should be updated', async () => {
      const result: UpdateInventoryResDto = new UpdateInventoryResDto();
      result.data = 1;
      result.message = 'Success';
      result.version = 'v1';
      result.status = 200;

      const dto: UpdateInventoryReqDto = {
        name: 'test',
        quantity: 1,
        updateBy: 1,
        isDeleted: false,
      };
      jest
        .spyOn(service, 'updateInventoryById')
        .mockImplementation(async () => result);
      expect(await service.updateInventoryById(1, dto)).toEqual({
        message: 'Success',
        status: 200,
        data: 1,
        version: 'v1',
      });
    });
  });
});

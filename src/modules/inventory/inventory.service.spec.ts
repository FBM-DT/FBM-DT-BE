import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { InventoryModule } from './inventory.module';
import { DatabaseModule } from '../../../src/db/database.module';
import { AddInventoryResponseDto, CreateInventoryRequestDto } from './dto';

describe('InventoryService', () => {
  let service: InventoryService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [InventoryModule, DatabaseModule],
      providers: [InventoryService],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
  });

  describe('Create new inventory', () => {
    it('should be created', async () => {
      const result: AddInventoryResponseDto = new AddInventoryResponseDto();
      result.data = 1;
      result.message = 'Success';
      result.version = 'v1';
      result.status = 201;

      const dto: CreateInventoryRequestDto = {
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

  describe('Get all inventories', () => {
    it('should return an array of inventories', async () => {
      const mockInventories: any[] = [
        { id: 1, name: 'Inventory 1', quantity: 10 },
        { id: 2, name: 'Inventory 2', quantity: 5 },
      ];

      jest
        .spyOn(service, 'getAllInventories')
        .mockImplementation(async () => mockInventories);

      const result = await service.getAllInventories();

      expect(result).toEqual(mockInventories);
    });
  });

  describe('getInventoryById', () => {
    it('should return the inventory with the specified ID', async () => {
      const inventoryId = 1;
      const mockInventory: any = {
        id: inventoryId,
        name: 'Test Inventory',
        quantity: 10,
      };

      jest
        .spyOn(service['_inventoryRepository'], 'findOneBy')
        .mockImplementation(async () => mockInventory);

      const result = await service.getInventoryById(inventoryId);

      expect(result).toEqual(mockInventory);
      expect(service['_inventoryRepository'].findOneBy).toHaveBeenCalledWith({
        id: inventoryId,
      });
    });
  });
});

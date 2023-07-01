import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CONNECTION } from '../../core/constants';
import { DataSource, DeleteQueryBuilder, Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { AddInventoryResponseDto } from './dto/Inventory.response.dto';
import { AppResponse } from '../../core/shared/app.response';
import { CreateInventoryRequestDto, UpdateInventoryRequestDto } from './dto';

@Injectable()
export class InventoryService {
  private _inventoryRepository: Repository<Inventory>;
  constructor(@Inject(CONNECTION) dataSource: DataSource) {
    this._inventoryRepository = dataSource.getRepository(Inventory);
  }
  async createInventory(
    data: CreateInventoryRequestDto,
  ): Promise<AddInventoryResponseDto> {
    const response: AddInventoryResponseDto = new AddInventoryResponseDto();

    try {
      const result = await this._inventoryRepository
        .createQueryBuilder()
        .insert()
        .into(Inventory)
        .values(data)
        .execute();

      AppResponse.setSuccessResponse<AddInventoryResponseDto>(
        response,
        result.identifiers[0].id,
      );

      return response;
    } catch (error) {
      console.log(
        '🚀 ~ file: inventory.service.ts:30 ~ InventoryService ~ createInventory ~ error:',
        error.message,
      );
      throw new Error(error.message);
    }
  }

  async getAllInventories(): Promise<Inventory[]> {
    try {
      const response: Inventory[] = await this._inventoryRepository.find();
      console.log(
        '🚀 ~ file: inventory.service.ts:39 ~ InventoryService ~ getAllInventories ~ response:',
        response,
      );

      return response;
    } catch (error) {
      console.log(
        '🚀 ~ file: inventory.service.ts:30 ~ InventoryService ~ getWorkShiftList ~ error:',
        error,
      );
    }
  }

  async getInventoryById(inventoryId: number): Promise<Inventory> {
    try {
      const response: Inventory = await this._inventoryRepository.findOneBy({
        id: inventoryId,
      });

      return response;
    } catch (error) {
      console.log(
        '🚀 ~ file: inventory.service.ts:30 ~ InventoryService ~ getWorkShiftList ~ error:',
        error,
      );
      throw new Error(error.message);
    }
  }

  async updateInventoryById(
    inventoryId: number,
    updateInventoryDto: UpdateInventoryRequestDto,
  ): Promise<Inventory> {
    const inventory: Inventory = await this._inventoryRepository.findOneBy({
      id: inventoryId,
    });
    if (!inventory) {
      throw new NotFoundException(
        `Inventory with ID ${inventoryId} not found. `,
      );
    }

    try {
      await this._inventoryRepository
        .createQueryBuilder()
        .update(Inventory)
        .set(updateInventoryDto)
        .where('id = :id', { id: inventoryId })
        .execute();

      const updatedInventory: Inventory =
        await this._inventoryRepository.findOneBy({
          id: inventoryId,
        });

      return updatedInventory;
    } catch (error) {
      console.log(
        '🚀 ~ file: inventory.service.ts:104 ~ InventoryService ~ error:',
        error,
      );

      throw new Error(error.message);
    }
  }

  async deleteInventoryById(inventoryId: number): Promise<Inventory> {
    try {
      const deletedInventory = await this._inventoryRepository
        .createQueryBuilder('inventory')
        .update(Inventory)
        .set({ isDeleted: true })
        .where('inventory.id = :id', { id: inventoryId })
        .returning('*')
        .execute();

      if (deletedInventory.affected === 0) {
        throw new NotFoundException(
          `Inventory with ID ${inventoryId} not found.`,
        );
      }

      return deletedInventory.raw[0];
    } catch (error) {
      console.log('Error occurred during deletion:', error.message);
      throw error;
    }
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { TYPEORM } from '../../core/constants';
import { DataSource, Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { AppResponse } from '../../core/shared/app.response';
import { CreateInventoryReqDto, UpdateInventoryReqDto } from './dto/request';
import {
  AddInventoryResDto,
  DeleteInventoryResDto,
  GetAllInventoryResDto,
  GetInventoryResDto,
  UpdateInventoryResDto,
} from './dto/response';
import { ErrorMessage } from './constants/errorMessage';

@Injectable()
export class InventoryService {
  private _inventoryRepository: Repository<Inventory>;
  constructor(@Inject(TYPEORM) dataSource: DataSource) {
    this._inventoryRepository = dataSource.getRepository(Inventory);
  }
  async createInventory(
    data: CreateInventoryReqDto,
  ): Promise<AddInventoryResDto> {
    try {
      const result = await this._inventoryRepository
        .createQueryBuilder()
        .insert()
        .into(Inventory)
        .values(data)
        .execute();

      return AppResponse.setSuccessResponse<AddInventoryResDto>(
        result.identifiers[0].id,
        {
          status: 201,
          message: 'Created',
        },
      );
    } catch (error) {
      return AppResponse.setAppErrorResponse(error.message);
    }
  }

  async getAllInventories(): Promise<GetAllInventoryResDto> {
    try {
      const data: Inventory[] = await this._inventoryRepository.find();
      return AppResponse.setSuccessResponse<GetAllInventoryResDto>(data, {
        page: 1,
        pageSize: data.length,
      });
    } catch (error) {
      return AppResponse.setAppErrorResponse(error.message);
    }
  }

  async getInventoryById(inventoryId: number): Promise<GetInventoryResDto> {
    try {
      const data: Inventory = await this._inventoryRepository.findOneBy({
        id: inventoryId,
      });
      if (!data) {
        return AppResponse.setUserErrorResponse(
          ErrorMessage.INVENTORY_NOT_FOUND,
        );
      }

      return AppResponse.setSuccessResponse<GetInventoryResDto>(data);
    } catch (error) {
      return AppResponse.setAppErrorResponse(error.message);
    }
  }

  async updateInventoryById(
    inventoryId: number,
    updateInventoryDto: UpdateInventoryReqDto,
  ): Promise<UpdateInventoryResDto> {
    const inventory: Inventory = await this._inventoryRepository.findOneBy({
      id: inventoryId,
    });

    if (!inventory) {
      return AppResponse.setUserErrorResponse(
        ErrorMessage.INVENTORY_NOT_FOUND,
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

      return AppResponse.setSuccessResponse<UpdateInventoryResDto>(updatedInventory);
    } catch (error) {
      return AppResponse.setAppErrorResponse(error.message);
    }
  }

  async deleteInventoryById(
    inventoryId: number,
  ): Promise<DeleteInventoryResDto> {
    try {
      const inventory: Inventory = await this._inventoryRepository.findOneBy({
        id: inventoryId,
      });

      if (inventory.isDeleted === true) {
        return AppResponse.setUserErrorResponse(
          ErrorMessage.INVENTORY_ALREADY_DELETED,
        );
      }

      const deletedInventory = await this._inventoryRepository
        .createQueryBuilder('inventory')
        .update(Inventory)
        .set({ isDeleted: true })
        .where('inventory.id = :id', { id: inventoryId })
        .returning('*')
        .execute();

      if (deletedInventory.affected === 0) {
        return AppResponse.setUserErrorResponse(
          ErrorMessage.INVENTORY_NOT_FOUND,
        );
      }

      return AppResponse.setSuccessResponse<DeleteInventoryResDto>(
        deletedInventory.raw[0],
      );
    } catch (error) {
      return AppResponse.setAppErrorResponse(error.message);
    }
  }
}

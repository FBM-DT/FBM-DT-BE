import { Inject, Injectable } from '@nestjs/common';
import { TYPEORM } from '@/core/constants';
import { DataSource, Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { AppResponse } from '@/core/shared/app.response';
import { CreateInventoryReqDto, UpdateInventoryReqDto } from './dto/request';
import {
  AddInventoryResDto,
  DeleteInventoryResDto,
  GetAllInventoryResDto,
  GetInventoryResDto,
  UpdateInventoryResDto,
} from './dto/response';
import { ErrorHandler } from '../../core/shared/common/error';
import { Account } from '../auth/account.entity';

@Injectable()
export class InventoryService {
  private _inventoryRepository: Repository<Inventory>;
  private _dataSource: DataSource;

  constructor(@Inject(TYPEORM) dataSource: DataSource) {
    this._dataSource = dataSource;
    this._inventoryRepository = dataSource.getRepository(Inventory);
  }
  async createInventory(
    data: CreateInventoryReqDto,
  ): Promise<AddInventoryResDto> {
    try {
      const isExistAccount = await this._dataSource
        .getRepository(Account)
        .findOneBy({ id: data.updateBy });

      if (!isExistAccount) {
        return AppResponse.setUserErrorResponse(
          ErrorHandler.notFound(`Account not with id ${data.updateBy}`),
          { status: 400 },
        );
      }

      const result = await this._inventoryRepository
        .createQueryBuilder()
        .insert()
        .into(Inventory)
        .values(data)
        .execute();

      return AppResponse.setSuccessResponse<AddInventoryResDto>(
        {
          inventoryId: result.identifiers[0].id,
        },
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
          ErrorHandler.notFound('Inventory with id ${inventoryId}'),
          { status: 400 },
        );
      }

      return AppResponse.setSuccessResponse<GetInventoryResDto>(data);
    } catch (error) {
      return AppResponse.setAppErrorResponse(error.message);
    }
  }

  async getInventoryByAccountId(
    accountId: number,
  ): Promise<GetInventoryResDto> {
    try {
      const data = await this._dataSource
        .getRepository(Account)
        .createQueryBuilder('a')
        .innerJoin('a.inventories', 'inventory')
        .addSelect([
          'inventory.id',
          'inventory.name',
          'inventory.quantity',
          'inventory.updateBy',
          'inventory.isDeleted',
        ])
        .where('a.id = :id', { id: accountId })
        .getOne();

      if (!data) {
        return AppResponse.setUserErrorResponse(
          ErrorHandler.notFound(`Inventory with id ${accountId}`),
          { status: 400 },
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
        ErrorHandler.notFound(`Inventory not with id ${inventoryId} found`),
        { status: 400 },
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

      return AppResponse.setSuccessResponse<UpdateInventoryResDto>(
        updatedInventory,
      );
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
          ErrorHandler.notFound(`Inventory not with id ${inventoryId}`),
          { status: 400 },
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
          ErrorHandler.notFound(`Inventory not with id ${inventoryId}`),
          { status: 400 },
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

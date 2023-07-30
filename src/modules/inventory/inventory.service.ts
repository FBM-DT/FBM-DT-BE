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
import { ErrorHandler } from '../../core/shared/common/error';

@Injectable()
export class InventoryService {
  private _inventoryRepository: Repository<Inventory>;
  constructor(@Inject(TYPEORM) dataSource: DataSource) {
    this._inventoryRepository = dataSource.getRepository(Inventory);
  }
  async createInventory(
    data: CreateInventoryReqDto,
  ): Promise<AddInventoryResDto> {
    const response: AddInventoryResDto = new AddInventoryResDto();

    try {
      const result = await this._inventoryRepository
        .createQueryBuilder()
        .insert()
        .into(Inventory)
        .values(data)
        .execute();

      AppResponse.setSuccessResponse<AddInventoryResDto>(
        response,
        result.identifiers[0].id,
        {
          status: 201,
          message: 'Created',
        },
      );

      return response;
    } catch (error) {
      AppResponse.setAppErrorResponse(response, error.message);
    }
  }

  async getAllInventories(): Promise<GetAllInventoryResDto> {
    const response: GetAllInventoryResDto = new GetAllInventoryResDto();
    try {
      const data: Inventory[] = await this._inventoryRepository.find();
      AppResponse.setSuccessResponse<GetAllInventoryResDto>(response, data, {
        page: 1,
        pageSize: data.length,
      });
      return response;
    } catch (error) {
      AppResponse.setAppErrorResponse(response, error.message);
    }
  }

  async getInventoryById(inventoryId: number): Promise<GetInventoryResDto> {
    const response: GetInventoryResDto = new GetInventoryResDto();
    try {
      const data: Inventory = await this._inventoryRepository.findOneBy({
        id: inventoryId,
      });
      if (!data) {
        AppResponse.setUserErrorResponse(
          response,
          ErrorHandler.notFound(`Inventory with id ${inventoryId}`),
        );
        return response;
      }

      AppResponse.setSuccessResponse<GetInventoryResDto>(response, data);

      return response;
    } catch (error) {
      AppResponse.setAppErrorResponse(response, error.message);
      return response;
    }
  }

  async updateInventoryById(
    inventoryId: number,
    updateInventoryDto: UpdateInventoryReqDto,
  ): Promise<UpdateInventoryResDto> {
    const inventory: Inventory = await this._inventoryRepository.findOneBy({
      id: inventoryId,
    });
    const response: UpdateInventoryResDto = new UpdateInventoryResDto();

    if (!inventory) {
      AppResponse.setUserErrorResponse(
        response,
        ErrorHandler.notFound(`Inventory with id ${inventoryId}`),
      );
      return response;
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

      AppResponse.setSuccessResponse<UpdateInventoryResDto>(
        response,
        updatedInventory,
      );
      return response;
    } catch (error) {
      AppResponse.setAppErrorResponse(response, error.message);
      return response;
    }
  }

  async deleteInventoryById(
    inventoryId: number,
  ): Promise<DeleteInventoryResDto> {
    const response: DeleteInventoryResDto = new DeleteInventoryResDto();
    try {
      const inventory: Inventory = await this._inventoryRepository.findOneBy({
        id: inventoryId,
      });

      if (inventory.isDeleted === true) {
        AppResponse.setUserErrorResponse(
          response,
          ErrorMessage.INVENTORY_ALREADY_DELETED,
        );
        return response;
      }

      const deletedInventory = await this._inventoryRepository
        .createQueryBuilder('inventory')
        .update(Inventory)
        .set({ isDeleted: true })
        .where('inventory.id = :id', { id: inventoryId })
        .returning('*')
        .execute();

      if (deletedInventory.affected === 0) {
        AppResponse.setUserErrorResponse(
          response,
          ErrorHandler.notFound(`Inventory with id ${inventoryId}`),
        );
        return response;
      }

      AppResponse.setSuccessResponse<DeleteInventoryResDto>(
        response,
        deletedInventory.raw[0],
      );
      return response;
    } catch (error) {
      AppResponse.setAppErrorResponse(response, error.message);
    }
  }
}

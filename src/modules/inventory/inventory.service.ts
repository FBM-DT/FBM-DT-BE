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
    let response: AddInventoryResDto = new AddInventoryResDto();

    try {
      const result = await this._inventoryRepository
        .createQueryBuilder()
        .insert()
        .into(Inventory)
        .values(data)
        .execute();

      response = AppResponse.setSuccessResponse<AddInventoryResDto>(
        result.identifiers[0].id,
        {
          status: 201,
          message: 'Created',
        },
      );

      return response;
    } catch (error) {
      response = AppResponse.setAppErrorResponse(error.message);
      return response;
    }
  }

  async getAllInventories(): Promise<GetAllInventoryResDto> {
    let response: GetAllInventoryResDto = new GetAllInventoryResDto();
    try {
      const data: Inventory[] = await this._inventoryRepository.find();
      response = AppResponse.setSuccessResponse<GetAllInventoryResDto>(data, {
        page: 1,
        pageSize: data.length,
      });
      return response;
    } catch (error) {
      response = AppResponse.setAppErrorResponse(error.message);
      return response;
    }
  }

  async getInventoryById(inventoryId: number): Promise<GetInventoryResDto> {
    let response: GetInventoryResDto = new GetInventoryResDto();
    try {
      const data: Inventory = await this._inventoryRepository.findOneBy({
        id: inventoryId,
      });
      if (!data) {
        response = AppResponse.setUserErrorResponse(
          ErrorMessage.INVENTORY_NOT_FOUND,
        );
        return response;
      }

      response = AppResponse.setSuccessResponse<GetInventoryResDto>(data);

      return response;
    } catch (error) {
      response = AppResponse.setAppErrorResponse(error.message);
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
    let response: UpdateInventoryResDto = new UpdateInventoryResDto();

    if (!inventory) {
      response = AppResponse.setUserErrorResponse(
        ErrorMessage.INVENTORY_NOT_FOUND,
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

      response =
        AppResponse.setSuccessResponse<UpdateInventoryResDto>(updatedInventory);
      return response;
    } catch (error) {
      response = AppResponse.setAppErrorResponse(error.message);
      return response;
    }
  }

  async deleteInventoryById(
    inventoryId: number,
  ): Promise<DeleteInventoryResDto> {
    let response: DeleteInventoryResDto = new DeleteInventoryResDto();
    try {
      const inventory: Inventory = await this._inventoryRepository.findOneBy({
        id: inventoryId,
      });

      if (inventory.isDeleted === true) {
        response = AppResponse.setUserErrorResponse(
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
        response = AppResponse.setUserErrorResponse(
          ErrorMessage.INVENTORY_NOT_FOUND,
        );
        return response;
      }

      response = AppResponse.setSuccessResponse<DeleteInventoryResDto>(
        deletedInventory.raw[0],
      );
      return response;
    } catch (error) {
      response = AppResponse.setAppErrorResponse(error.message);
      return response;
    }
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TYPEORM } from '../../../core/constants';
import { AppResponse } from '../../../core/shared/app.response';
import { Position } from '../entities/position.entity';
import {
  CreatePositionResDto,
  GetPositionResDto,
  GetPositionsResDto,
  UpdatePositionResDto,
} from '../dto/position/res/position.dto';
import { CreatePositionReqDto } from '../dto/position/req/position.dto';
import { ErrorHandler } from 'src/core/shared/common/error';

@Injectable()
export class PositionService {
  private readonly _positionRepository: Repository<Position>;
  private _dataSource: DataSource;

  constructor(@Inject(TYPEORM) dataSource: DataSource) {
    this._dataSource = dataSource;
    this._positionRepository = this._dataSource.getRepository(Position);
  }

  async getPositions(): Promise<GetPositionsResDto> {
    try {
      const positions = await this._positionRepository.find();
      return AppResponse.setSuccessResponse<GetPositionsResDto>(positions);
    } catch (error) {
      return AppResponse.setAppErrorResponse<GetPositionsResDto>(error.message);
    }
  }

  async getPosition(id: number): Promise<GetPositionResDto> {
    try {
      const position = await this._positionRepository.findOne({
        where: { id },
      });

      if (!position)
        return AppResponse.setUserErrorResponse<GetPositionResDto>(
          ErrorHandler.notFound(`The position ${id}`),
        );

      return AppResponse.setSuccessResponse<GetPositionResDto>(position);
    } catch (error) {
      return AppResponse.setAppErrorResponse<GetPositionResDto>(error.message);
    }
  }

  async createPosition(
    position: CreatePositionReqDto,
  ): Promise<CreatePositionResDto> {
    try {
      const createdPosition = await this._positionRepository.createQueryBuilder().insert().into(Position).values(position).execute();
      return AppResponse.setSuccessResponse<CreatePositionResDto>(
        createdPosition,
      );
    } catch (error) {
      return AppResponse.setAppErrorResponse<CreatePositionResDto>(
        error.message,
      );
    }
  }

  async updatePosition(
    id: number,
    name: CreatePositionReqDto,
  ): Promise<UpdatePositionResDto> {
    try {
      const existPosition = await this._positionRepository.findOne({
        where: { id },
      });

      if (!existPosition)
        return AppResponse.setUserErrorResponse<UpdatePositionResDto>(
          ErrorHandler.notFound(`The position ${id}`),
        );

      const updatedPosition = await this._positionRepository
        .createQueryBuilder('position')
        .update(Position)
        .set(name)
        .where('id = :id', { id })
        .execute();

      return AppResponse.setSuccessResponse<UpdatePositionResDto>(
        updatedPosition.affected,
      );
    } catch (error) {
      return AppResponse.setAppErrorResponse<UpdatePositionResDto>(
        error.message,
      );
    }
  }
}

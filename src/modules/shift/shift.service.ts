import { Inject, Injectable } from '@nestjs/common';
import {
  AddWorkShiftReqDto,
  GetWorkShiftListReqDto,
  UpdateWorkShiftReqDto,
} from './dto/request';
import {
  UpdateWorkShiftResDto,
  GetWorkShiftListResDto,
  GetWorkShiftResDto,
  DeleteWorkShiftResDto,
  AddWorkShiftResDto,
} from './dto/response';
import { SEARCH_TYPE, TYPEORM, WORKTYPE } from '../../core/constants';
import { DataSource, FindManyOptions, Repository } from 'typeorm';
import { WorkShift } from './entities/workShift.entity';
import { AppResponse } from '../../core/shared/app.response';
import { StaffShift } from './entities/staffInShift.entity';
import { Task } from '../task/entities/task.entity';
import { ExtraQuery } from '../../core/utils';

@Injectable()
export class ShiftService {
  private _workShiftRepository: Repository<WorkShift>;
  private _dataSource: DataSource;
  constructor(
    @Inject(TYPEORM)
    dataSource: DataSource,
  ) {
    this._dataSource = dataSource;
    this._workShiftRepository = dataSource.getRepository(WorkShift);
  }

  async createWorkShift(data: AddWorkShiftReqDto): Promise<AddWorkShiftResDto> {
    try {
      const result = await this._workShiftRepository
        .createQueryBuilder()
        .insert()
        .into(WorkShift)
        .values(data)
        .execute();
      return AppResponse.setSuccessResponse<AddWorkShiftResDto>(
        result.identifiers[0].id,
        {
          status: 201,
          message: 'Created',
        },
      );
    } catch (error) {
      return AppResponse.setAppErrorResponse<AddWorkShiftResDto>(
        error.message,
      );
    }
  }

  async getWorkShift(workShiftId: number): Promise<GetWorkShiftResDto> {
    try {
      const result: WorkShift = await this._workShiftRepository.findOneBy({
        id: workShiftId,
      });
      return AppResponse.setSuccessResponse<GetWorkShiftResDto>(result);
    } catch (error) {
      return AppResponse.setAppErrorResponse<AddWorkShiftResDto>(
        error.message,
      );
    }
  }

  async getWorkShiftList(
    queries: GetWorkShiftListReqDto,
  ): Promise<GetWorkShiftListResDto> {
    try {
      if (Object.keys(queries).length > 0) {
        let options: FindManyOptions = new Object();
        ExtraQuery.paginateBy(
          {
            page: queries.page,
            pageSize: queries.pageSize,
          },
          options,
        );
        ExtraQuery.sortBy<WorkShift>(queries.sort, options);
        ExtraQuery.searchBy<WorkShift>(
          {
            address: queries.address,
            name: queries.name?.toLowerCase(),
            position: queries.position,
          },
          options,
          SEARCH_TYPE.AND,
        );
        ExtraQuery.searchByEnum<WorkShift>(
          { type: WORKTYPE[queries.type?.toUpperCase()] },
          options,
          SEARCH_TYPE.AND,
        );
        const result: WorkShift[] = await this._workShiftRepository.find(
          options,
        );

        return AppResponse.setSuccessResponse<GetWorkShiftListResDto>(
          result,
          {
            page: queries.page,
            pageSize: queries.pageSize,
          },
        );
      }
      const result: WorkShift[] = await this._workShiftRepository.find();
      return AppResponse.setSuccessResponse<GetWorkShiftListResDto>(result);
    } catch (error) {
      return AppResponse.setAppErrorResponse<AddWorkShiftResDto>(
        error.message,
      );
    }
  }

  async deleteWorkShift(workShiftId: number): Promise<DeleteWorkShiftResDto> {
    try {
      const result = await this._dataSource.transaction(
        'SERIALIZABLE',
        async (transaction) => {
          let returnValues: Object = new Object();
          const deleteWorkShiftReturn = await transaction
            .getRepository(WorkShift)
            .delete({ id: workShiftId });
          const deleteStaffShiftReturn = await transaction
            .getRepository(StaffShift)
            .delete({
              workShiftId: workShiftId,
            });
          const deleteRelatedTasksReturn = await transaction
            .getRepository(Task)
            .delete({
              workShiftId: workShiftId,
            });
          returnValues = {
            workShift: deleteWorkShiftReturn.affected,
            staffShift: deleteStaffShiftReturn.affected,
            tasks: deleteRelatedTasksReturn.affected,
          };
          return returnValues;
        },
      );
      return AppResponse.setSuccessResponse<DeleteWorkShiftResDto>(result);
    } catch (error) {
      return AppResponse.setAppErrorResponse<AddWorkShiftResDto>(
        error.message,
      );
    }
  }

  async updateWorkShift(
    workShiftId: number,
    workShiftDto: UpdateWorkShiftReqDto,
  ): Promise<UpdateWorkShiftResDto> {
    try {
      const result = await this._workShiftRepository
        .createQueryBuilder('workshift')
        .update(WorkShift)
        .where('workshift.id = :workShiftId', { workShiftId: workShiftId })
        .set(workShiftDto)
        .execute();
      return AppResponse.setSuccessResponse<DeleteWorkShiftResDto>(
        result.affected,
      );
    } catch (error) {
      return AppResponse.setAppErrorResponse<AddWorkShiftResDto>(
        error.message,
      );
    }
  }
}

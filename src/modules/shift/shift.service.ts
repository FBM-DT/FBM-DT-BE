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
    let response: AddWorkShiftResDto = new AddWorkShiftResDto();
    try {
      const result = await this._workShiftRepository
        .createQueryBuilder()
        .insert()
        .into(WorkShift)
        .values(data)
        .execute();
      response = AppResponse.setSuccessResponse<AddWorkShiftResDto>(
        result.identifiers[0].id,
        {
          status: 201,
          message: 'Created',
        },
      );
      return response;
    } catch (error) {
      response = AppResponse.setAppErrorResponse<AddWorkShiftResDto>(
        error.message,
      );
      return response;
    }
  }

  async getWorkShift(workShiftId: number): Promise<GetWorkShiftResDto> {
    let response: GetWorkShiftResDto = new GetWorkShiftResDto();
    try {
      const result: WorkShift = await this._workShiftRepository.findOneBy({
        id: workShiftId,
      });
      response = AppResponse.setSuccessResponse<GetWorkShiftResDto>(result);
      return response;
    } catch (error) {
      response = AppResponse.setAppErrorResponse<AddWorkShiftResDto>(
        error.message,
      );
      return response;
    }
  }

  async getWorkShiftList(
    queries: GetWorkShiftListReqDto,
  ): Promise<GetWorkShiftListResDto> {
    let response: GetWorkShiftListResDto = new GetWorkShiftListResDto();
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

        response = AppResponse.setSuccessResponse<GetWorkShiftListResDto>(
          result,
          {
            page: queries.page,
            pageSize: queries.pageSize,
          },
        );
        return response;
      }
      const result: WorkShift[] = await this._workShiftRepository.find();
      response = AppResponse.setSuccessResponse<GetWorkShiftListResDto>(result);
      return response;
    } catch (error) {
      response = AppResponse.setAppErrorResponse<AddWorkShiftResDto>(
        error.message,
      );
      return response;
    }
  }

  async deleteWorkShift(workShiftId: number): Promise<DeleteWorkShiftResDto> {
    let response: DeleteWorkShiftResDto = new DeleteWorkShiftResDto();
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
      response = AppResponse.setSuccessResponse<DeleteWorkShiftResDto>(result);
      return response;
    } catch (error) {
      response = AppResponse.setAppErrorResponse<AddWorkShiftResDto>(
        error.message,
      );
      return response;
    }
  }

  async updateWorkShift(
    workShiftId: number,
    workShiftDto: UpdateWorkShiftReqDto,
  ): Promise<UpdateWorkShiftResDto> {
    let response: UpdateWorkShiftResDto = new UpdateWorkShiftResDto();
    try {
      const result = await this._workShiftRepository
        .createQueryBuilder('workshift')
        .update(WorkShift)
        .where('workshift.id = :workShiftId', { workShiftId: workShiftId })
        .set(workShiftDto)
        .execute();
      response = AppResponse.setSuccessResponse<DeleteWorkShiftResDto>(
        result.affected,
      );
      return response;
    } catch (error) {
      response = AppResponse.setAppErrorResponse<AddWorkShiftResDto>(
        error.message,
      );
      return response;
    }
  }
}

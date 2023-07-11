import { Inject, Injectable } from '@nestjs/common';
import {
  AddWorkShiftRequestDto,
  AddWorkShiftResponseDto,
  DeleteWorkShiftByIdResponseDto,
  GetWorkShiftByIdResponseDto,
  GetWorkShiftListByQueriesRequestDto,
  GetWorkShiftListByQueriesResponseDto,
  GetWorkShiftListResponseDto,
  UpdateWorkShiftRequestDto,
  UpdateWorkShiftResponseDto,
} from './dto';
import { CONNECTION, WORKTYPE } from '../../core/constants';
import {
  DataSource,
  FindManyOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { WorkShift } from './entities/work-shift.entity';
import { AppResponse } from '../../core/shared/app.response';
import { Staff_Shift } from './entities/staffInShift.entity';
import { Task } from '../task/task.entity';

@Injectable()
export class ShiftService {
  private _workShiftRepository: Repository<WorkShift>;
  private _dataSource: DataSource;
  constructor(
    @Inject(CONNECTION)
    dataSource: DataSource,
  ) {
    this._dataSource = dataSource;
    this._workShiftRepository = dataSource.getRepository(WorkShift);
  }

  async createWorkShift(
    data: AddWorkShiftRequestDto,
  ): Promise<AddWorkShiftResponseDto> {
    const response: AddWorkShiftResponseDto = new AddWorkShiftResponseDto();
    try {
      const result = await this._workShiftRepository
        .createQueryBuilder()
        .insert()
        .into(WorkShift)
        .values(data)
        .execute();
      AppResponse.setSuccessResponse<AddWorkShiftResponseDto>(
        response,
        result.identifiers[0].id,
        {
          status: 201,
          message: 'Created',
        },
      );
      return response;
    } catch (error) {
      AppResponse.setAppErrorResponse<AddWorkShiftResponseDto>(
        response,
        error.message,
      );
      return response;
    }
  }

  async getWorkShiftList(): Promise<GetWorkShiftListResponseDto> {
    const response: GetWorkShiftListResponseDto =
      new GetWorkShiftListResponseDto();
    try {
      const result: WorkShift[] = await this._workShiftRepository.find();
      AppResponse.setSuccessResponse<GetWorkShiftListResponseDto>(
        response,
        result,
      );
      return response;
    } catch (error) {
      AppResponse.setAppErrorResponse<AddWorkShiftResponseDto>(
        response,
        error.message,
      );
      return response;
    }
  }

  async getAWorkShiftById(
    workShiftId: number,
  ): Promise<GetWorkShiftByIdResponseDto> {
    const response: GetWorkShiftByIdResponseDto =
      new GetWorkShiftByIdResponseDto();
    try {
      const result: WorkShift = await this._workShiftRepository.findOneBy({
        id: workShiftId,
      });
      AppResponse.setSuccessResponse<GetWorkShiftByIdResponseDto>(
        response,
        result,
      );
      return response;
    } catch (error) {
      AppResponse.setAppErrorResponse<AddWorkShiftResponseDto>(
        response,
        error.message,
      );
      return response;
    }
  }

  async getWorkShiftFilteredList(
    queries: GetWorkShiftListByQueriesRequestDto,
  ): Promise<GetWorkShiftListByQueriesResponseDto> {
    const response: GetWorkShiftListByQueriesResponseDto =
      new GetWorkShiftListByQueriesResponseDto();
    try {
      let options: FindManyOptions;
      let whereConditions: FindOptionsWhere<WorkShift>;

      if (queries.page && queries.pageSize) {
        options = {
          ...options,
          skip: (queries.page - 1) * queries.pageSize,
          take: queries.pageSize,
        };
      }
      if (queries.sortBy && queries.sortValue) {
        options = {
          ...options,
          order: { [queries.sortBy]: queries.sortValue },
        };
      }

      if (queries.address) {
        whereConditions = { ...whereConditions, address: queries.address };
      }

      if (queries.type) {
        whereConditions = {
          ...whereConditions,
          type: WORKTYPE[queries.type.toUpperCase()],
        };
      }

      if (whereConditions) {
        options = { ...options, where: whereConditions };
      }

      const result: WorkShift[] = await this._workShiftRepository.find(options);
      AppResponse.setSuccessResponse<GetWorkShiftListByQueriesResponseDto>(
        response,
        result,
        {
          page: queries.page,
          pageSize: queries.pageSize,
        },
      );
      return response;
    } catch (error) {
      AppResponse.setAppErrorResponse<AddWorkShiftResponseDto>(
        response,
        error.message,
      );
      return response;
    }
  }

  async deleteWorkShiftById(
    workShiftId: number,
  ): Promise<DeleteWorkShiftByIdResponseDto> {
    const response: DeleteWorkShiftByIdResponseDto =
      new DeleteWorkShiftByIdResponseDto();
    try {
      const result = await this._dataSource.transaction(
        'SERIALIZABLE',
        async (transaction) => {
          let returnValues: Object = new Object();
          const deleteWorkShiftReturn = await transaction
            .getRepository(WorkShift)
            .delete({ id: workShiftId });
          const deleteStaffShiftReturn = await transaction
            .getRepository(Staff_Shift)
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
      AppResponse.setSuccessResponse<DeleteWorkShiftByIdResponseDto>(
        response,
        result,
      );
      return response;
    } catch (error) {
      AppResponse.setAppErrorResponse<AddWorkShiftResponseDto>(
        response,
        error.message,
      );
      return response;
    }
  }

  async updateWorkShift(
    workShiftId: number,
    workShiftDto: UpdateWorkShiftRequestDto,
  ): Promise<UpdateWorkShiftResponseDto> {
    const response: UpdateWorkShiftResponseDto =
      new UpdateWorkShiftResponseDto();
    try {
      const result = await this._workShiftRepository
        .createQueryBuilder('workshift')
        .update(WorkShift)
        .where('workshift.id = :workShiftId', { workShiftId: workShiftId })
        .set(workShiftDto)
        .execute();
      AppResponse.setSuccessResponse<DeleteWorkShiftByIdResponseDto>(
        response,
        result.affected,
      );
      return response;
    } catch (error) {
      AppResponse.setAppErrorResponse<AddWorkShiftResponseDto>(
        response,
        error.message,
      );
      return response;
    }
  }
}

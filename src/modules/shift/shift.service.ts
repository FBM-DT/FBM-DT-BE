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
import { TYPEORM, WORKTYPE } from '../../core/constants';
import {
  DataSource,
  FindManyOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { WorkShift } from './entities/workShift.entity';
import { AppResponse } from '../../core/shared/app.response';
import { StaffShift } from './entities/staffInShift.entity';
import { Task } from '../task/entities/task.entity';
import { TransformTypeormOption } from '../../core/utils/tranform.typeorm';

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
    const response: AddWorkShiftResDto = new AddWorkShiftResDto();
    try {
      const result = await this._workShiftRepository
        .createQueryBuilder()
        .insert()
        .into(WorkShift)
        .values(data)
        .execute();
      AppResponse.setSuccessResponse<AddWorkShiftResDto>(
        response,
        result.identifiers[0].id,
        {
          status: 201,
          message: 'Created',
        },
      );
      return response;
    } catch (error) {
      AppResponse.setAppErrorResponse<AddWorkShiftResDto>(
        response,
        error.message,
      );
      return response;
    }
  }

  async getWorkShift(workShiftId: number): Promise<GetWorkShiftResDto> {
    const response: GetWorkShiftResDto = new GetWorkShiftResDto();
    try {
      const result: WorkShift = await this._workShiftRepository.findOneBy({
        id: workShiftId,
      });
      AppResponse.setSuccessResponse<GetWorkShiftResDto>(response, result);
      return response;
    } catch (error) {
      AppResponse.setAppErrorResponse<AddWorkShiftResDto>(
        response,
        error.message,
      );
      return response;
    }
  }

  async getWorkShiftList(
    queries: GetWorkShiftListReqDto,
  ): Promise<GetWorkShiftListResDto> {
    const response: GetWorkShiftListResDto = new GetWorkShiftListResDto();
    try {
      if (Object.keys(queries).length > 0) {
        let options: FindManyOptions;
        let whereConditions: FindOptionsWhere<WorkShift>;

        if (queries.page && queries.pageSize) {
          TransformTypeormOption.convertPaginationOptions(
            { page: queries.page, pageSize: queries.pageSize },
            options,
          );
        }

        if (queries.sortBy && queries.sortValue) {
          // FilterConvert.convertSearchOptions(
          //   { sortBy: queries.sortBy, sortValue: queries.sortValue },
          //   whereConditions,
          // );
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

        const result: WorkShift[] = await this._workShiftRepository.find(
          options,
        );

        AppResponse.setSuccessResponse<GetWorkShiftListResDto>(
          response,
          result,
          {
            page: queries.page,
            pageSize: queries.pageSize,
          },
        );
        return response;
      }
      const result: WorkShift[] = await this._workShiftRepository.find();
      AppResponse.setSuccessResponse<GetWorkShiftListResDto>(response, result);
      return response;
    } catch (error) {
      AppResponse.setAppErrorResponse<AddWorkShiftResDto>(
        response,
        error.message,
      );
      return response;
    }
  }

  async deleteWorkShift(workShiftId: number): Promise<DeleteWorkShiftResDto> {
    const response: DeleteWorkShiftResDto = new DeleteWorkShiftResDto();
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
      AppResponse.setSuccessResponse<DeleteWorkShiftResDto>(response, result);
      return response;
    } catch (error) {
      AppResponse.setAppErrorResponse<AddWorkShiftResDto>(
        response,
        error.message,
      );
      return response;
    }
  }

  async updateWorkShift(
    workShiftId: number,
    workShiftDto: UpdateWorkShiftReqDto,
  ): Promise<UpdateWorkShiftResDto> {
    const response: UpdateWorkShiftResDto = new UpdateWorkShiftResDto();
    try {
      const result = await this._workShiftRepository
        .createQueryBuilder('workshift')
        .update(WorkShift)
        .where('workshift.id = :workShiftId', { workShiftId: workShiftId })
        .set(workShiftDto)
        .execute();
      AppResponse.setSuccessResponse<DeleteWorkShiftResDto>(
        response,
        result.affected,
      );
      return response;
    } catch (error) {
      AppResponse.setAppErrorResponse<AddWorkShiftResDto>(
        response,
        error.message,
      );
      return response;
    }
  }
}

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
import { Task, TaskNote } from '../task/entities';
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
    const queryRunner = this._dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction('SERIALIZABLE');
      const addWorkShiftResult = await queryRunner.manager
        .getRepository(WorkShift)
        .createQueryBuilder()
        .insert()
        .into(WorkShift)
        .values(data.workShift)
        .execute();
      data.task = {
        ...data.task,
        workShiftId: addWorkShiftResult.identifiers[0].id,
      };
      const addTaskResult = await queryRunner.manager
        .getRepository(Task)
        .createQueryBuilder()
        .insert()
        .into(Task)
        .values(data.task)
        .execute();
      data.taskNote.forEach((note) => {
        note = Object.assign(note, { taskId: addTaskResult.identifiers[0].id });
      });
      const addTaskNoteResult = await queryRunner.manager
        .getRepository(TaskNote)
        .createQueryBuilder()
        .insert()
        .into(TaskNote)
        .values(data.taskNote)
        .execute();
      await queryRunner.commitTransaction();
      return AppResponse.setSuccessResponse<AddWorkShiftResDto>(
        {
          workShift: addWorkShiftResult.identifiers[0].id,
          task: addTaskResult.identifiers[0].id,
          taskNote: addTaskNoteResult.identifiers,
        },
        {
          status: 201,
          message: 'Created',
        },
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return AppResponse.setAppErrorResponse<AddWorkShiftResDto>(
        error.message,
      );
    } finally {
      await queryRunner.release();
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
        ExtraQuery.searchByConstant<WorkShift>(
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
    const response: DeleteWorkShiftResDto = new DeleteWorkShiftResDto();
    const queryRunner = this._dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction('SERIALIZABLE');

      let returnValues: Object = new Object();
      const deleteWorkShiftReturn = await queryRunner.manager
        .getRepository(WorkShift)
        .delete({ id: workShiftId });
      const deleteStaffShiftReturn = await queryRunner.manager
        .getRepository(StaffShift)
        .delete({
          workShiftId: workShiftId,
        });
      returnValues = {
        workShift: deleteWorkShiftReturn.affected,
        staffShift: deleteStaffShiftReturn.affected,
      };
      await queryRunner.commitTransaction();
      AppResponse.setSuccessResponse<DeleteWorkShiftResDto>(
        response,
        returnValues,
      );
      return response;
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

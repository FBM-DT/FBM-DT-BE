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
import { Shift } from './entities/shift.entity';
import { AppResponse } from '../../core/shared/app.response';
import { Schedule } from './entities/schedule.entity';
import { Task } from '../task/entities';
import { ExtraQuery } from '../../core/utils';
import { AddTaskNoteResDto } from '../task/dto/response';
import { AddTaskNoteReqDto } from '../task/dto/request';
import { Note } from '../note/note.entity';

@Injectable()
export class ShiftService {
  private _workShiftRepository: Repository<Shift>;
  private _dataSource: DataSource;
  constructor(
    @Inject(TYPEORM)
    dataSource: DataSource,
  ) {
    this._dataSource = dataSource;
    this._workShiftRepository = dataSource.getRepository(Shift);
  }

  async createWorkShift(data: AddWorkShiftReqDto): Promise<AddWorkShiftResDto> {
    const queryRunner = this._dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction('SERIALIZABLE');
      const addWorkShiftResult = await queryRunner.manager
        .getRepository(Shift)
        .createQueryBuilder()
        .insert()
        .into(Shift)
        .values(data.workShift)
        .execute();

      data.task.forEach((task) => {
        task = Object.assign(task, {
          workShiftId: addWorkShiftResult.identifiers[0].id,
        });
      });
      const addTaskResult = await queryRunner.manager
        .getRepository(Task)
        .createQueryBuilder()
        .insert()
        .into(Task)
        .values(data.task)
        .execute();

      const taskNotes: Array<AddTaskNoteReqDto> = new Array<AddTaskNoteReqDto>;
      
      addTaskResult.identifiers.forEach((item, index) => {
        data.task[index].taskNote.forEach((note) => {
          note = Object.assign(note, {
            taskId: item['id'],
          });
          taskNotes.push(note);
        });
      });

      const addTaskNoteResult = await queryRunner.manager
        .getRepository(Note)
        .createQueryBuilder()
        .insert()
        .into(Note)
        .values(taskNotes)
        .execute();
      await queryRunner.commitTransaction();
      return AppResponse.setSuccessResponse<AddWorkShiftResDto>(
        {
          workShift: addWorkShiftResult.identifiers,
          task: addTaskResult.identifiers,
          taskNote: addTaskNoteResult.identifiers,
        },
        {
          status: 201,
          message: 'Created',
        },
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return AppResponse.setAppErrorResponse<AddWorkShiftResDto>(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async getWorkShift(workShiftId: number): Promise<GetWorkShiftResDto> {
    try {
      const result: Shift = await this._workShiftRepository.findOneBy({
        id: workShiftId,
      });
      return AppResponse.setSuccessResponse<GetWorkShiftResDto>(result);
    } catch (error) {
      return AppResponse.setAppErrorResponse<AddWorkShiftResDto>(error.message);
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
        ExtraQuery.sortBy<Shift>(queries.sort, options);
        ExtraQuery.searchBy<Shift>(
          {
            address: queries.address,
            name: queries.name?.toLowerCase(),
            position: queries.position,
          },
          options,
          SEARCH_TYPE.AND,
        );
        ExtraQuery.searchByConstant<Shift>(
          { type: WORKTYPE[queries.type?.toUpperCase()] },
          options,
          SEARCH_TYPE.AND,
        );
        const result: Shift[] = await this._workShiftRepository.find(
          options,
        );

        return AppResponse.setSuccessResponse<GetWorkShiftListResDto>(result, {
          page: queries.page,
          pageSize: queries.pageSize,
        });
      }
      const result: Shift[] = await this._workShiftRepository.find();
      return AppResponse.setSuccessResponse<GetWorkShiftListResDto>(result);
    } catch (error) {
      return AppResponse.setAppErrorResponse<AddWorkShiftResDto>(error.message);
    }
  }

  async deleteWorkShift(shiftId: number): Promise<DeleteWorkShiftResDto> {
    const response: DeleteWorkShiftResDto = new DeleteWorkShiftResDto();
    const queryRunner = this._dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction('SERIALIZABLE');

      let returnValues: Object = new Object();
      const deleteWorkShiftReturn = await queryRunner.manager
        .getRepository(Shift)
        .delete({ id: shiftId });
      const deleteStaffShiftReturn = await queryRunner.manager
        .getRepository(Schedule)
        .delete({
          shiftId: shiftId,
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
      return AppResponse.setAppErrorResponse<AddWorkShiftResDto>(error.message);
    }
  }

  async updateWorkShift(
    workShiftId: number,
    workShiftDto: UpdateWorkShiftReqDto,
  ): Promise<UpdateWorkShiftResDto> {
    try {
      const result = await this._workShiftRepository
        .createQueryBuilder('workshift')
        .update(Shift)
        .where('workshift.id = :workShiftId', { workShiftId: workShiftId })
        .set(workShiftDto)
        .execute();
      return AppResponse.setSuccessResponse<DeleteWorkShiftResDto>(
        result.affected,
      );
    } catch (error) {
      return AppResponse.setAppErrorResponse<AddWorkShiftResDto>(error.message);
    }
  }
}

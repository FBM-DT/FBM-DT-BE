import { Inject, Injectable } from '@nestjs/common';
import {
  AddShiftReqDto,
  GetShiftListReqDto,
  UpdateShiftReqDto,
} from './dto/request';
import {
  UpdateShiftResDto,
  GetShiftListResDto,
  GetShiftResDto,
  DeleteShiftResDto,
  AddShiftResDto,
} from './dto/response';
import { SEARCH_TYPE, TYPEORM } from '@BE/core/constants';
import { DataSource, FindManyOptions, Repository } from 'typeorm';
import { Shift } from './entities/shift.entity';
import { AppResponse } from '@BE/core/shared/app.response';
import { Schedule } from './entities/schedule.entity';
import { Task } from '@BE/modules/task/entities';
import { ExtraQuery } from '@BE/core/utils';
import { Note } from '@BE/modules/note/note.entity';

@Injectable()
export class ShiftService {
  private _shiftRepository: Repository<Shift>;
  private _dataSource: DataSource;
  constructor(
    @Inject(TYPEORM)
    dataSource: DataSource,
  ) {
    this._dataSource = dataSource;
    this._shiftRepository = dataSource.getRepository(Shift);
  }

  async createShift(inputPayload: AddShiftReqDto): Promise<AddShiftResDto> {
    const queryRunner = this._dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction('SERIALIZABLE');
      const addShiftResult = await queryRunner.manager
        .getRepository(Shift)
        .createQueryBuilder()
        .insert()
        .into(Shift)
        .values(inputPayload.shift)
        .execute();

      if (inputPayload.task && inputPayload.task?.length > 0) {
        inputPayload.task.forEach((task) => {
          task = Object.assign(task, {
            shiftId: addShiftResult.identifiers[0].id,
          });
        });
        var addTaskResult = await queryRunner.manager
          .getRepository(Task)
          .createQueryBuilder()
          .insert()
          .into(Task)
          .values(inputPayload.task)
          .execute();
      }

      if (inputPayload.note && inputPayload.note?.length > 0) {
        inputPayload.note.forEach((note) => {
          note = Object.assign(note, {
            shiftId: addShiftResult.identifiers[0].id,
          });
        });

        var addNoteResult = await queryRunner.manager
          .getRepository(Note)
          .createQueryBuilder()
          .insert()
          .into(Note)
          .values(inputPayload.note)
          .execute();
      }

      await queryRunner.commitTransaction();
      return AppResponse.setSuccessResponse<AddShiftResDto>(
        {
          shift: addShiftResult.identifiers[0].id,
          task: addTaskResult.identifiers,
          note: addNoteResult.identifiers,
        },
        {
          status: 201,
          message: 'Created',
        },
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return AppResponse.setAppErrorResponse<AddShiftResDto>(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async getShift(shiftId: number): Promise<GetShiftResDto> {
    try {
      const result: Shift = await this._shiftRepository
        .createQueryBuilder('shift')
        .innerJoin('shift.tasks', 'task')
        .innerJoin('shift.notes', 'note')
        .addSelect([
          'task.shiftId',
          'task.name',
          'task.status',
          'note.context',
          'note.shiftId',
          'note.createdBy',
        ])
        .where('shift.id = :shiftId', { shiftId: shiftId })
        .getOne();

      return AppResponse.setSuccessResponse<GetShiftResDto>(result);
    } catch (error) {
      return AppResponse.setAppErrorResponse<AddShiftResDto>(error.message);
    }
  }

  async getShiftList(queries: GetShiftListReqDto): Promise<GetShiftListResDto> {
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
        const result: Shift[] = await this._shiftRepository.find(options);

        return AppResponse.setSuccessResponse<GetShiftListResDto>(result, {
          page: queries.page,
          pageSize: queries.pageSize,
        });
      }
      const result: Shift[] = await this._shiftRepository.find();
      return AppResponse.setSuccessResponse<GetShiftListResDto>(result);
    } catch (error) {
      return AppResponse.setAppErrorResponse<AddShiftResDto>(error.message);
    }
  }

  async deleteShift(shiftId: number): Promise<DeleteShiftResDto> {
    const queryRunner = this._dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction('SERIALIZABLE');

      let returnValues: Object = new Object();
      const deleteShiftReturn = await queryRunner.manager
        .getRepository(Shift)
        .delete({ id: shiftId });
      const deteleScheduleReturn = await queryRunner.manager
        .getRepository(Schedule)
        .delete({
          shiftId: shiftId,
        });
      returnValues = {
        shift: deleteShiftReturn.affected,
        schedule: deteleScheduleReturn.affected,
      };
      await queryRunner.commitTransaction();
      return AppResponse.setSuccessResponse<DeleteShiftResDto>(returnValues);
    } catch (error) {
      return AppResponse.setAppErrorResponse<AddShiftResDto>(error.message);
    }
  }

  async updateShift(
    shiftId: number,
    shiftDto: UpdateShiftReqDto,
  ): Promise<UpdateShiftResDto> {
    try {
      const result = await this._shiftRepository
        .createQueryBuilder('shift')
        .update(Shift)
        .where('shift.id = :shiftId', { shiftId: shiftId })
        .set(shiftDto)
        .execute();
      return AppResponse.setSuccessResponse<DeleteShiftResDto>(result.affected);
    } catch (error) {
      return AppResponse.setAppErrorResponse<AddShiftResDto>(error.message);
    }
  }
}

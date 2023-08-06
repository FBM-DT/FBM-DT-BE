import { Inject, Injectable } from '@nestjs/common';
import { SEARCH_TYPE, TYPEORM } from '../../core/constants';
import { DataSource, FindManyOptions } from 'typeorm';
import {
  AddTaskResDto,
  DeleteTaskResDto,
  GetTaskListResDto,
  UpdateTaskResDto,
} from './dto/response';
import { AppResponse } from '../../core/shared/app.response';
import {
  AddTaskReqDto,
  GetTaskListReqDto,
  UpdateTaskReqDto,
} from './dto/request';
import { Task } from './entities';
import { ExtraQuery } from '../../core/utils';

@Injectable()
export class TaskService {
  private _dataSource: DataSource;
  constructor(
    @Inject(TYPEORM)
    dataSource: DataSource,
  ) {
    this._dataSource = dataSource;
  }

  async addNewTask(
    workShiftId: number,
    data: AddTaskReqDto,
  ): Promise<AddTaskResDto> {
    try {
      data = {
        ...data,
        workShiftId: workShiftId,
      };
      const result = await this._dataSource
        .getRepository(Task)
        .createQueryBuilder()
        .insert()
        .into(Task)
        .values(data)
        .execute();
      return AppResponse.setSuccessResponse(result.identifiers[0].id, {
        status: 201,
        message: 'Created',
      });
    } catch (error) {
      return AppResponse.setAppErrorResponse<AddTaskResDto>(error.message);
    }
  }

  async updateTask(
    taskId: number,
    data: UpdateTaskReqDto,
  ): Promise<UpdateTaskResDto> {
    try {
      const result = await this._dataSource
        .getRepository(Task)
        .createQueryBuilder('task')
        .update(Task)
        .where('task.id = :taskId', { taskId: taskId })
        .set(data)
        .execute();
      return AppResponse.setSuccessResponse<UpdateTaskResDto>(result.affected);
    } catch (error) {
      return AppResponse.setAppErrorResponse<UpdateTaskResDto>(error.message);
    }
  }

  async deleteTask(taskId: number): Promise<DeleteTaskResDto> {
    try {
      const deletedTaskResult = await this._dataSource
        .getRepository(Task)
        .delete({ id: taskId });

      return AppResponse.setSuccessResponse<DeleteTaskResDto>(
        deletedTaskResult.affected,
      );
    } catch (error) {
      return AppResponse.setAppErrorResponse<DeleteTaskResDto>(error.message);
    }
  }

  async getTaskList(
    workShiftId: number,
    queries: GetTaskListReqDto,
  ): Promise<GetTaskListResDto> {
    try {
      let options: FindManyOptions = new Object();
      ExtraQuery.searchByConstant<Task>(
        { workShiftId: workShiftId },
        options,
        SEARCH_TYPE.AND,
      );
      if (Object.keys(queries).length > 0) {
        ExtraQuery.paginateBy(
          {
            page: queries.page,
            pageSize: queries.pageSize,
          },
          options,
        );
        ExtraQuery.sortBy<Task>(queries.sort, options);
        ExtraQuery.searchBy<Task>(
          {
            name: queries.name,
          },
          options,
          SEARCH_TYPE.AND,
        );
        ExtraQuery.searchByConstant<Task>(
          {
            status: queries.status,
          },
          options,
          SEARCH_TYPE.AND,
        );
      }

      const result: Task[] = await this._dataSource
        .getRepository(Task)
        .find(options);
      return AppResponse.setSuccessResponse<GetTaskListResDto>(result, {
        page: queries.page,
        pageSize: queries.pageSize,
      });
    } catch (error) {
      return AppResponse.setAppErrorResponse<GetTaskListResDto>(error.message);
    }
  }
}

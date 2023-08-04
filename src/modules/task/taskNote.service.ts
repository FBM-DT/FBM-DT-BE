import { Inject, Injectable } from '@nestjs/common';
import { SEARCH_TYPE, TYPEORM } from '../../core/constants';
import { DataSource, FindManyOptions } from 'typeorm';
import {
  AddTaskNoteResDto,
  DeleteTaskNoteResDto,
  GetTaskNoteListResDto,
  GetTaskNoteResDto,
  UpdateTaskNoteResDto,
} from './dto/response';
import {
  AddTaskNoteReqDto,
  GetTaskNoteListReqDto,
  UpdateTaskNoteReqDto,
} from './dto/request';
import { AppResponse } from '../../core/shared/app.response';
import { TaskNote } from './entities';
import { ExtraQuery } from '../../core/utils';

@Injectable()
export class TaskNoteService {
  private _dataSource: DataSource;
  constructor(
    @Inject(TYPEORM)
    dataSource: DataSource,
  ) {
    this._dataSource = dataSource;
  }

  async addNote(
    taskId: number,
    data: AddTaskNoteReqDto,
  ): Promise<AddTaskNoteResDto> {
    try {
      data = {
        ...data,
        taskId: taskId,
      };
      const result = await this._dataSource
        .getRepository(TaskNote)
        .createQueryBuilder()
        .insert()
        .into(TaskNote)
        .values(data)
        .execute();
      return AppResponse.setSuccessResponse<AddTaskNoteResDto>(
        result.identifiers[0].id,
      );
    } catch (error) {
      return AppResponse.setAppErrorResponse<AddTaskNoteResDto>(error.message);
    }
  }

  async updateNote(
    noteId: number,
    data: UpdateTaskNoteReqDto,
  ): Promise<UpdateTaskNoteResDto> {
    try {
      const result = await this._dataSource
        .getRepository(TaskNote)
        .createQueryBuilder('note')
        .update(TaskNote)
        .where('note.id = :noteId', { noteId: noteId })
        .set(data)
        .execute();
      return AppResponse.setSuccessResponse<UpdateTaskNoteResDto>(
        result.affected,
      );
    } catch (error) {
      return AppResponse.setAppErrorResponse<UpdateTaskNoteResDto>(
        error.message,
      );
    }
  }

  async deleteNote(noteId: number): Promise<DeleteTaskNoteResDto> {
    try {
      const result = await this._dataSource
        .getRepository(TaskNote)
        .delete({ id: noteId });
      return AppResponse.setSuccessResponse<DeleteTaskNoteResDto>(
        result.affected,
      );
    } catch (error) {
      return AppResponse.setAppErrorResponse<DeleteTaskNoteResDto>(
        error.message,
      );
    }
  }

  async getNoteList(
    taskId: number,
    queries: GetTaskNoteListReqDto,
  ): Promise<GetTaskNoteListResDto> {
    try {
      let options: FindManyOptions = new Object();
      ExtraQuery.searchByConstant<TaskNote>(
        { taskId: taskId },
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
        ExtraQuery.sortBy<TaskNote>(queries.sort, options);
        ExtraQuery.searchBy<TaskNote>(
          {
            context: queries.context,
          },
          options,
          SEARCH_TYPE.AND,
        );
      }
      const result: TaskNote[] = await this._dataSource
        .getRepository(TaskNote)
        .find(options);
      return AppResponse.setSuccessResponse<GetTaskNoteListResDto>(result, {
        page: queries.page,
        pageSize: queries.pageSize,
      });
    } catch (error) {
      return AppResponse.setAppErrorResponse<GetTaskNoteListResDto>(
        error.message,
      );
    }
  }

  async getNote(noteId: number): Promise<GetTaskNoteResDto> {
    try {
      const result: TaskNote = await this._dataSource
        .getRepository(TaskNote)
        .findOneBy({ id: noteId });
      return AppResponse.setSuccessResponse<GetTaskNoteResDto>(result);
    } catch (error) {
      return AppResponse.setAppErrorResponse<GetTaskNoteResDto>(error.message);
    }
  }
}

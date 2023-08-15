import { Inject, Injectable } from '@nestjs/common';
import { SEARCH_TYPE, TYPEORM } from '../../core/constants';
import { DataSource, FindManyOptions } from 'typeorm';
import { AppResponse } from '../../core/shared/app.response';
import { Note } from './note.entity';
import { ExtraQuery } from '../../core/utils';
import { AddNoteReqDto, GetNoteListReqDto, UpdateNoteReqDto } from './dto/request';
import { AddNoteResDto, DeleteNoteResDto, GetNoteListResDto, GetNoteResDto, UpdateNoteResDto } from './dto/response';

@Injectable()
export class NoteService {
  private _dataSource: DataSource;
  constructor(
    @Inject(TYPEORM)
    dataSource: DataSource,
  ) {
    this._dataSource = dataSource;
  }

  async addNote(
    shiftId: number,
    data: AddNoteReqDto,
  ): Promise<AddNoteResDto> {
    try {
      data = {
        ...data,
        shiftId: shiftId,
      };
      const result = await this._dataSource
        .getRepository(Note)
        .createQueryBuilder()
        .insert()
        .into(Note)
        .values(data)
        .execute();
      return AppResponse.setSuccessResponse<AddNoteResDto>(
        result.identifiers[0].id,
      );
    } catch (error) {
      return AppResponse.setAppErrorResponse<AddNoteResDto>(error.message);
    }
  }

  async updateNote(
    noteId: number,
    data: UpdateNoteReqDto,
  ): Promise<UpdateNoteResDto> {
    try {
      const result = await this._dataSource
        .getRepository(Note)
        .createQueryBuilder('note')
        .update(Note)
        .where('note.id = :noteId', { noteId: noteId })
        .set(data)
        .execute();
      return AppResponse.setSuccessResponse<UpdateNoteResDto>(
        result.affected,
      );
    } catch (error) {
      return AppResponse.setAppErrorResponse<UpdateNoteResDto>(
        error.message,
      );
    }
  }

  async deleteNote(noteId: number): Promise<DeleteNoteResDto> {
    try {
      const result = await this._dataSource
        .getRepository(Note)
        .delete({ id: noteId });
      return AppResponse.setSuccessResponse<DeleteNoteResDto>(
        result.affected,
      );
    } catch (error) {
      return AppResponse.setAppErrorResponse<DeleteNoteResDto>(
        error.message,
      );
    }
  }

  async getNotes(
    shiftId: number,
    queries: GetNoteListReqDto,
  ): Promise<GetNoteListResDto> {
    try {
      let options: FindManyOptions = new Object();
      ExtraQuery.searchByConstant<Note>(
        { shiftId: shiftId },
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
        ExtraQuery.sortBy<Note>(queries.sort, options);
        ExtraQuery.searchBy<Note>(
          {
            context: queries.context,
          },
          options,
          SEARCH_TYPE.AND,
        );
      }
      const result: Note[] = await this._dataSource
        .getRepository(Note)
        .find(options);
      return AppResponse.setSuccessResponse<GetNoteListResDto>(result, {
        page: queries.page,
        pageSize: queries.pageSize,
      });
    } catch (error) {
      return AppResponse.setAppErrorResponse<GetNoteListResDto>(
        error.message,
      );
    }
  }

  async getNote(noteId: number): Promise<GetNoteResDto> {
    try {
      const result: Note = await this._dataSource
        .getRepository(Note)
        .findOneBy({ id: noteId });
      return AppResponse.setSuccessResponse<GetNoteResDto>(result);
    } catch (error) {
      return AppResponse.setAppErrorResponse<GetNoteResDto>(error.message);
    }
  }
}

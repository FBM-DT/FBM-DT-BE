import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { NoteService } from './note.service';
import {
  AddNoteReqDto,
  GetNoteListReqDto,
  UpdateNoteReqDto,
} from './dto/request';
import {
  AddNoteResDto,
  DeleteNoteResDto,
  GetNoteListResDto,
  GetNoteResDto,
  UpdateNoteResDto,
} from './dto/response';
@Controller('note')
export class NoteController {
  constructor(private noteService: NoteService) {}
  @Post(':shiftId/shiftNote/create')
  async addNote(
    @Body() dto: AddNoteReqDto,
    @Param('shiftId', ParseIntPipe) shiftId: number,
  ): Promise<AddNoteResDto> {
    const response: AddNoteResDto = await this.noteService.addNote(
      shiftId,
      dto,
    );
    return response;
  }

  @Patch('shiftNote/update/:noteId')
  async updateNote(
    @Param('noteId', ParseIntPipe) noteId: number,
    @Body() dto: UpdateNoteReqDto,
  ): Promise<UpdateNoteResDto> {
    const response: UpdateNoteResDto = await this.noteService.updateNote(
      noteId,
      dto,
    );
    return response;
  }

  @Delete('shiftNote/delete/:noteId')
  async deleteNote(
    @Param('noteId', ParseIntPipe) noteId: number,
  ): Promise<DeleteNoteResDto> {
    const response: DeleteNoteResDto = await this.noteService.deleteNote(
      noteId,
    );
    return response;
  }

  @Get(':shiftId/shiftNotes/list')
  async getNotes(
    @Param('shiftId', ParseIntPipe) shiftId: number,
    @Query() queries: GetNoteListReqDto,
  ): Promise<GetNoteListResDto> {
    const response: GetNoteListResDto = await this.noteService.getNotes(
      shiftId,
      queries,
    );
    return response;
  }

  @Get('shiftNote/:noteId')
  async getNote(
    @Param('noteId', ParseIntPipe) noteId: number,
  ): Promise<GetNoteResDto> {
    const response: GetNoteResDto = await this.noteService.getNote(noteId);
    return response;
  }
}

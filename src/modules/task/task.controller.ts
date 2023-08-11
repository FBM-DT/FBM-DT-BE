import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  AddTaskNoteResDto,
  AddTaskResDto,
  DeleteTaskNoteResDto,
  DeleteTaskResDto,
  GetTaskListResDto,
  GetTaskNoteListResDto,
  GetTaskNoteResDto,
  GetTaskResDto,
  UpdateTaskNoteResDto,
  UpdateTaskResDto,
} from './dto/response';
import { TaskService } from './task.service';
import {
  AddTaskNoteReqDto,
  AddTaskReqDto,
  GetTaskListReqDto,
  GetTaskNoteListReqDto,
  UpdateTaskNoteReqDto,
  UpdateTaskReqDto,
} from './dto/request';
import { TaskNoteService } from './taskNote.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Tasks')
@Controller('task')
export class TaskController {
  constructor(
    private taskService: TaskService,
    private taskNoteService: TaskNoteService,
  ) {}

  @ApiOperation({ description: 'Create new task' })
  @ApiResponse({
    description: 'Create successfully',
    status: HttpStatus.CREATED,
    type: AddTaskResDto,
  })
  @Post(':workShiftId/create')
  async addNewTask(
    @Body() dto: AddTaskReqDto,
    @Param('workShiftId', ParseIntPipe) workShiftId: number,
  ): Promise<AddTaskResDto> {
    const response: AddTaskResDto = await this.taskService.addNewTask(
      workShiftId,
      dto,
    );
    return response;
  }

  @Patch('update/:taskId')
  async updateTask(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() dto: UpdateTaskReqDto,
  ): Promise<UpdateTaskResDto> {
    const response: UpdateTaskResDto = await this.taskService.updateTask(
      taskId,
      dto,
    );
    return response;
  }

  @Delete('delete/:taskId')
  async deleteTask(
    @Param('taskId', ParseIntPipe) taskId: number,
  ): Promise<DeleteTaskResDto> {
    const response: DeleteTaskResDto = await this.taskService.deleteTask(
      taskId,
    );
    return response;
  }

  @ApiOperation({ description: 'Get task list by workshift id' })
  @ApiResponse({
    description: 'Get successfully',
    status: HttpStatus.OK,
    type: GetTaskListResDto,
  })
  @Get('list/:workShiftId')
  async getTaskList(
    @Query() queries: GetTaskListReqDto,
    @Param('workShiftId', ParseIntPipe) workShiftId: number,
  ): Promise<GetTaskListResDto> {
    const response: GetTaskListResDto = await this.taskService.getTaskList(
      workShiftId,
      queries,
    );
    return response;
  }

  @Get('taskById/:taskId')
  async getTask(
    @Param('taskId', ParseIntPipe) taskId: number,
  ): Promise<GetTaskResDto> {
    const response: GetTaskResDto = await this.taskService.getTask(taskId);
    return response;
  }

  @Post(':taskId/taskNote/create')
  async addNote(
    @Body() dto: AddTaskNoteReqDto,
    @Param('taskId', ParseIntPipe) taskId: number,
  ): Promise<AddTaskNoteResDto> {
    const response: AddTaskNoteResDto = await this.taskNoteService.addNote(
      taskId,
      dto,
    );
    return response;
  }

  @Patch('taskNote/update/:noteId')
  async updateNote(
    @Param('noteId', ParseIntPipe) noteId: number,
    @Body() dto: UpdateTaskNoteReqDto,
  ): Promise<UpdateTaskNoteResDto> {
    const response: UpdateTaskNoteResDto =
      await this.taskNoteService.updateNote(noteId, dto);
    return response;
  }

  @Delete('taskNote/delete/:noteId')
  async deleteNote(
    @Param('noteId', ParseIntPipe) noteId: number,
  ): Promise<DeleteTaskNoteResDto> {
    const response: DeleteTaskNoteResDto =
      await this.taskNoteService.deleteNote(noteId);
    return response;
  }

  @Get(':taskId/taskNote/list')
  async getNoteList(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Query() queries: GetTaskNoteListReqDto,
  ): Promise<GetTaskNoteListResDto> {
    const response: GetTaskNoteListResDto =
      await this.taskNoteService.getNoteList(taskId, queries);
    return response;
  }

  @Get('taskNote/:noteId')
  async getNote(
    @Param('noteId', ParseIntPipe) noteId: number,
  ): Promise<GetTaskNoteResDto> {
    const response: GetTaskNoteResDto = await this.taskNoteService.getNote(
      noteId,
    );
    return response;
  }
}

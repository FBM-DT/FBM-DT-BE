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
  AddTaskResDto,
  DeleteTaskResDto,
  GetTaskListResDto,
  GetTaskResDto,
  UpdateTaskResDto,
} from './dto/response';
import { TaskService } from './task.service';
import {
  AddTaskReqDto,
  GetTaskListReqDto,
  UpdateTaskReqDto,
} from './dto/request';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Tasks')
@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

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
}

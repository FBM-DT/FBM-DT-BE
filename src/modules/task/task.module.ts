import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskNoteService } from './taskNote.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService, TaskNoteService]
})
export class TaskModule {}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskOwnerGuard } from './guards/task-owner.guard';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    const mockUserId = '64fa9c123456abcdef012345';
    return this.taskService.create(createTaskDto, mockUserId);
  }

  @Get()
  async findAllTasks(@Query('status') status?: string) {
    return this.taskService.findAll({ status });
  }

  @Delete(':id')
  @UseGuards(TaskOwnerGuard)
  async delete(@Param('id') id: string) {
    return this.taskService.delete(id);
  }
}

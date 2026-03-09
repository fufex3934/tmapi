import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskOwnerGuard } from './guards/task-owner.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: RequestWithUser,
  ) {
    return this.taskService.create(createTaskDto, req.user.userId);
  }

  @Get()
  async findAllTasks(@Query('status') status?: string) {
    return this.taskService.findAll({ status });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, TaskOwnerGuard)
  async delete(@Param('id') id: string) {
    return this.taskService.delete(id);
  }
}

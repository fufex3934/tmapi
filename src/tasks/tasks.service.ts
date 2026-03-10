import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksRepository } from './Repositories/tasks.repository';

export interface QueryOptions {
  status?: string;
  userId: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async create(createTaskDto: CreateTaskDto, userId: string) {
    return await this.tasksRepository.create(createTaskDto, userId);
  }

  async findAll(filter: QueryOptions) {
    return await this.tasksRepository.findAll(filter);
  }

  async findById(id: string) {
    return await this.tasksRepository.findById(id);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    return await this.tasksRepository.update(id, updateTaskDto);
  }

  async delete(id: string) {
    return await this.tasksRepository.delete(id);
  }
}

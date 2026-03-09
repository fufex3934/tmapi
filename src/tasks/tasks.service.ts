import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';

export interface QueryOptions {
  status?: string;
}

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const newTask = new this.taskModel({ ...createTaskDto, userId });
    return await newTask.save();
  }

  async findAll(filter?: QueryOptions): Promise<Task[]> {
    const query: QueryOptions = {};

    if (filter?.status) {
      Object.assign(query, filter);
    }
    return await this.taskModel.find(query).exec();
  }

  async findById(id: string): Promise<Task | null> {
    return await this.taskModel.findById(id).exec();
  }

  async delete(id: string): Promise<Task | null> {
    return await this.taskModel.findByIdAndDelete(id).exec();
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

export interface QueryOptions {
  status?: string;
  userId: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const newTask = new this.taskModel({ ...createTaskDto, userId });
    return await newTask.save();
  }

  async findAll(filter: QueryOptions): Promise<Task[]> {
    // Build the query object based on provided filters
    const query: QueryOptions = { userId: filter.userId };

    if (filter?.status) {
      query.status = filter.status;
    }

    const page = filter.page || 1;
    const limit = filter.limit || 10;

    return await this.taskModel

      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async findById(id: string): Promise<Task | null> {
    return await this.taskModel.findById(id).exec();
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task | null> {
    return await this.taskModel.findByIdAndUpdate(id, updateTaskDto, {
      new: true,
    });
  }

  async delete(id: string): Promise<Task | null> {
    return await this.taskModel.findByIdAndDelete(id).exec();
  }
}

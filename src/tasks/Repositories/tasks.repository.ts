import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from '../schemas/task.schema';
import { Model } from 'mongoose';
import { CreateTaskDto } from '../dto/create-task.dto';
import { QueryOptions } from '../tasks.service';
import { UpdateTaskDto } from '../dto/update-task.dto';

interface PaginatedResponse {
  data: Task[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class TasksRepository {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const newTask = new this.taskModel({ ...createTaskDto, userId });
    return await newTask.save();
  }

  async findAll(filter: QueryOptions): Promise<PaginatedResponse> {
    // Build the query object based on provided filters
    const query: any = { userId: filter.userId };

    if (filter?.status) {
      query.status = filter.status;
    }

    const page = filter.page || 1;
    const limit = filter.limit || 10;
    const skip = (page - 1) * limit;

    // Get both the data and total count in parallel for better performance
    const [data, total] = await Promise.all([
      this.taskModel.find(query).skip(skip).limit(limit).exec(),
      this.taskModel.countDocuments(query).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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

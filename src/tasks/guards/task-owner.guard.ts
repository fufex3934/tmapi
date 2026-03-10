import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TasksService } from '../tasks.service';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
  };
}

@Injectable()
export class TaskOwnerGuard implements CanActivate {
  constructor(private readonly tasksService: TasksService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const taskIdParam = request.params.id;
    const taskId = Array.isArray(taskIdParam) ? taskIdParam[0] : taskIdParam;
    const userId = request.user?.userId;
    const task = await this.tasksService.findById(taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.userId.toString() !== userId) {
      throw new ForbiddenException('You do not own this task');
    }
    return true;
  }
}

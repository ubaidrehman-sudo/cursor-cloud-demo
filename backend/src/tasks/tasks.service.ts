import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Task, TaskPriority } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { PrismaService } from './prisma.service';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        priority: createTaskDto.priority ?? TaskPriority.medium,
      },
    });
  }

  findAll(): Promise<Task[]> {
    return this.prisma.task.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateStatus(
    id: number,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    try {
      return await this.prisma.task.update({
        where: { id },
        data: { status: updateTaskStatusDto.status },
      });
    } catch (error: unknown) {
      this.handleNotFoundError(error, id);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.task.delete({
        where: { id },
      });
    } catch (error: unknown) {
      this.handleNotFoundError(error, id);
      throw error;
    }
  }

  private handleNotFoundError(error: unknown, id: number): void {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new NotFoundException(`Task with id ${id} was not found.`);
    }
  }
}

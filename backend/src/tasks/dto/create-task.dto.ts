import { TaskPriority } from '@prisma/client';
import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTaskDto {
  @IsString({ message: 'Task title must be a string.' })
  @MinLength(3, {
    message: 'Task title must be at least 3 characters long.',
  })
  @MaxLength(100, {
    message: 'Task title must be at most 100 characters long.',
  })
  title!: string;

  @IsEnum(TaskPriority, {
    message: 'Task priority must be one of: low, medium, high.',
  })
  priority!: TaskPriority;
}

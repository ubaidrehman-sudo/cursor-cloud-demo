import { TaskPriority } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTaskDto {
  @IsString({ message: 'Task title must be a string.' })
  @MinLength(3, {
    message: 'Task title must be at least 3 characters long.',
  })
  @MaxLength(100, {
    message: 'Task title must be at most 100 characters long.',
  })
  title!: string;

  @IsOptional()
  @IsEnum(TaskPriority, {
    message: 'Task priority must be one of: low, medium, high.',
  })
  priority?: TaskPriority;
}

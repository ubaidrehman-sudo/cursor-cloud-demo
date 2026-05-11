import { Task } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { PrismaService } from './prisma.service';
export declare class TasksService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createTaskDto: CreateTaskDto): Promise<Task>;
    findAll(): Promise<Task[]>;
    updateStatus(id: number, updateTaskStatusDto: UpdateTaskStatusDto): Promise<Task>;
    remove(id: number): Promise<void>;
    private handleNotFoundError;
}

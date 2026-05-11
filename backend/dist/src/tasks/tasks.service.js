"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("./prisma.service");
let TasksService = class TasksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createTaskDto) {
        return this.prisma.task.create({
            data: {
                title: createTaskDto.title,
            },
        });
    }
    findAll() {
        return this.prisma.task.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async updateStatus(id, updateTaskStatusDto) {
        try {
            return await this.prisma.task.update({
                where: { id },
                data: { status: updateTaskStatusDto.status },
            });
        }
        catch (error) {
            this.handleNotFoundError(error, id);
            throw error;
        }
    }
    async remove(id) {
        try {
            await this.prisma.task.delete({
                where: { id },
            });
        }
        catch (error) {
            this.handleNotFoundError(error, id);
            throw error;
        }
    }
    handleNotFoundError(error, id) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2025') {
            throw new common_1.NotFoundException(`Task with id ${id} was not found.`);
        }
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map
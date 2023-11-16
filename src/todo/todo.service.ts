import { Injectable,ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from "@prisma/client"

@Injectable()
export class TodoService {
    constructor (private prisma: PrismaService) {}

    // タスクの一覧を取得するデジタルロジック
    // fieldのuserIdと一致するタスクを全て取得する
    getTasks(userId: number): Promise<Task[]> {
        return this.prisma.task.findMany({
            where: {
                userId,
            },
            orderBy: {
                // createdAtを降順で取得する
                createdAt: "desc",
            }
        })
    }

    // 特定のタスクを取得するデジタルロジック
    getTaskById(userId: number, taskId: number): Promise<Task> {
        return this.prisma.task.findFirst({
            where: {
                id: taskId,
                userId,
            }
        })
    }

    // タスクを新規作成するデジタルロジック
    // async createTask(userId: number, dto: CreateTaskDto): Promise<Task> {
    //     const task = await this.prisma.task.create({
    //         data: {
    //             ...dto,
    //             userId,
    //         },
    //     })
    //     return task
    // }

    async createTask(userId: number, dto: CreateTaskDto): Promise<Task> {
        const task = await this.prisma.task.create({
          data: {
            userId,
            ...dto,
          },
        });
        return task;
      }

    // タスクを更新するデジタルロジック
    async updateTask(userId: number, taskId: number, dto: UpdateTaskDto) : Promise<Task> {
        // const Task = await this.prisma.task.update({
        //     where: {
        //         id: taskId,
        //         userId,
        //     },
        //     data: {
        //         ...dto,
        //     },
        // })
        // return Task

        // 更新するタスクが存在するか確認する
        const task = await this.prisma.task.findUnique({
            where: {
                id: taskId
            }
        })
        // タスクが存在しないまたはユーザーが一致しない場合はエラーを返す
        if(!task || task.userId !== userId) {
            throw new ForbiddenException('タスクが見つかりません')
        }

        return this.prisma.task.update({
            where: {
                id: taskId
            },
            data: {
                ...dto,
            },
        })
    }

    // タスクを削除するデジタルロジック
    async deleteTask(userId: number, taskId: number) : Promise<void> {
        const task = await this.prisma.task.findUnique({
            where: {
                id: taskId,
            },
        })

        if(!task || userId !== task.userId)
        throw new ForbiddenException('タスクが見つかりません')

        await this.prisma.task.delete({
            where: {
                id: taskId
            }
        })
    }
}

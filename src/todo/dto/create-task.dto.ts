// タスクの新規作成時のリクエストボディの型定義
import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    title: string
    
    @IsString()
    @IsOptional()
    description?: string
}
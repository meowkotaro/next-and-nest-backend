// ユーザーを更新するためのエンドポイントでクライアントからトランスファーオブジェクトとして送信されるデータを定義する
import { IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    nickname?: string
}
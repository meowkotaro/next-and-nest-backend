// emailとpasswordを受け取る
// class-validatorを使ってバリデーションを行う

import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class AuthDto {
    @IsEmail()      // emailの形式かどうか
    @IsNotEmpty()   // 空文字ではないかどうか
    email: string;

    @IsString()     // 文字列かどうか
    @IsNotEmpty()   // 空文字ではないかどうか
    @MinLength(1)   // 最小文字数
    password: string;
}

import { Controller, Body, Get, Patch, Req, UseGuards   } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // jwtのプロテクトをかけるために使用
import { Request } from 'express';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';

// エンドポイントをプロテクトするために、@UseGuards(AuthGuard('jwt'))を使用する
@UseGuards(AuthGuard('jwt')) // これでuserのエンドポイントにはjwtのプロテクトがかかる
@Controller('user')
export class UserController {
    // userServiceをインジェクションする
    constructor(private readonly userService: UserService) {}

    // ログインしているユーザー情報を取得
    @Get()
    getLoginUser(@Req() req: Request): Omit<User,'hashedPassword'> {
        // requestの型をcustom.d.tsで定義しているので、req.userを使用すると型が定義される
        return req.user
    }

    // ユーザー情報を更新
    @Patch()
    updateUser(
        @Req() req: Request,
        @Body() dto: UpdateUserDto
    ): Promise<Omit<User, "hashedPassword">> {
        // userServiceのupdateUserメソッドを使用してユーザー情報を更新する
        return this.userService.updateUser(req.user.id, dto)
    }
}

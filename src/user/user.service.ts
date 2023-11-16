import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
    // PrismaServiceをインジェクションする
    constructor(private readonly prisma: PrismaService) {}

    // nicknameを更新するデジタルロジック
    async updateUser(
        userId: number,
        dto: UpdateUserDto,
    ) : Promise<Omit<User, 'hashedPassword'>> {
        // ユーザーを更新
        const user = await this.prisma.user.update({
            where: {    // whereを使用して更新するユーザーを特定する
                id: userId
            },
            data: {     // dataを使用して更新する内容を指定する
                ...dto
            }
        }) 
        delete user.hashedPassword // hashedPasswordは返さないようにする
        return user
    }
}
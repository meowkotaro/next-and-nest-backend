// ビジネスロジックを記述する
import { Injectable, ForbiddenException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { Msg, Jwt } from './interfaces/auth.interface';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly Jwt: JwtService,
        private readonly config: ConfigService,
    ) {}

    // ユーザーの作成
    async signUp(dto: AuthDto): Promise<Msg> {
        // パスワードのハッシュ化
        const hashed = await bcrypt.hash(dto.password, 12)

        // prismaServiceの機能を使ってユーザーを作成
        try {
            await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hashedPassword: hashed,
                }
            })
            return { message: 'ユーザーを作成しました' } as Msg;
        } catch (error) {
            // errorの型がPrismaClientKnownRequestErrorの場合
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                // https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes に記載されているエラーコードを参照
                // emailが重複している場合 emailにはunique制約がついているため、重複するとエラーが発生する
                if (error.code === 'P2002') {
                    throw new ForbiddenException('このメールアドレスは既に使用されています'); // エラーを投げる
                }
            }
            throw error;
        }
    }

    // ログイン
    async login(dto: AuthDto): Promise<Jwt> {
        // emailを元にユーザーを検索
        const user = await this.prisma.user.findUnique({ // findUniqueは一意の値を持つカラムを元に検索する
            where: {
                email: dto.email // emailが一致するユーザーを検索
            }
        })

        // ユーザーが存在しない場合
        if(!user) throw new ForbiddenException("メールアドレスまたはパスワードが間違っています")

        // dtoとデータベースのハッシュ化されたパスワードを比較、検証
        const isValid = await bcrypt.compare(dto.password, user.hashedPassword)

        // 検証に失敗した場合
        if(!isValid) throw new ForbiddenException("メールアドレスまたはパスワードが間違っています")

        // JWTを作成
        return this.generateJwt(user.email, user.id)
    }

    // emailとuserIdを元にJWTを作成する
    async generateJwt(email: string, userId: number): Promise<Jwt> {
        const payload = { // JWTのペイロード
            sub: userId,
            email
        }
        const secret = this.config.get("JWT_SECRET") // .envに記載したJWT_SECRETを取得

        const token = await this.Jwt.signAsync(payload, {
            secret: secret, // JWT_SECRETを秘密鍵として使用
            expiresIn: "5m" // 有効期限
        })

        return {
            access_token: token
        }
    }
}

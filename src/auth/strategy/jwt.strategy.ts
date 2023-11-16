// jwtをstrategyとしてカスタマイズする
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable() // これは、NestJSのDIシステムによって、依存性の注入を可能にするデコレーター
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') { // PassportStrategyを継承したJwtStrategyを作成することで、jwtのプロテクトをかけることができる。
    constructor(
        private readonly config: ConfigService,
        private readonly prisma: PrismaService,
    ) {
        super({ // super()を使用して、PassportStrategyのコンストラクターの処理を参照する。
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => {
                    let jwt = null
                    if(req && req.cookies) {
                        jwt = req.cookies['access_token'] // cookieからjwtを取得する
                    }
                    return jwt
                }
            ]),
            ignoreExpiration: false, // jwtの有効期限を無視しない
            secretOrKey: config.get('JWT_SECRET') // JWT_SECRETを使用して、jwtを検証する
        })
    }

    // passport strategyのvalidate()メソッドをオーバーライドする
    async validate(payload: { sub: number, email: string }) {
        // payloadのsubを元にユーザーを検索
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub
            },
        })
        delete user.hashedPassword // hashedPasswordは返さないようにする

        // 返されたユーザー情報は、requestオブジェクトのuserプロパティに格納される
        return user
    }
}
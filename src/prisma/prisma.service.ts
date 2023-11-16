import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {           // PrismaClientを継承したPrismaServiceを作成することで、データベースを操作するためのメソッドを使用できるようになる。
    constructor(private readonly config: ConfigService) {   // ConfigServiceを使用するために、コンストラクターでインジェクションする。
        super({                                             // ここで設定した内容が、PrismaClientを継承したPrismaServiceに反映さる。
            datasources: {
                db: {
                    url : config.get("DATABASE_URL")        // ConfigServiceを使用して、環境変数を取得する。
                }
            }
        })
    }
}

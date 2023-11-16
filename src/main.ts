import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';  // バリデーションを行うために使用
import { Request } from 'express';                // クライアントのリクエストを取得するために使用
import * as cookieParser from 'cookie-parser'     // クライアントのリクエストからcookieを取得するために使用
import * as csurf from "csurf"                    // CSRF対策のために使用

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true })) // dtoに含まれないプロパティは無視する
  app.enableCors({ // CORS対策
    credentials: true, // cookieを使用するために必要
    origin: ['http://localhost:3000'] // フロントエンドのURL
  });
  app.use(cookieParser()) // cookieを解析するために使用

  // CSRF対策
  // csurfを使用する
  app.use(
    csurf({
    // cookieの設定
      cookie: {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      },
      // tokenを取得する
      value: (req: Request) => {
        return req.header('csrf-token')
      },
    })
  )

  

  //　本番環境ではprocess.env.PORTを使用する 
  await app.listen(process.env.PORT || 3005);
}
bootstrap();

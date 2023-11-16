import { Controller, Post, Body, HttpCode, HttpStatus,Res,Req,Get } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Csrf, Msg } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
    // AuthServiceを使用するので、dependency injectionを行う
    constructor(private readonly authService: AuthService) {}

    @Get('/csrf')
    getCsrfToken(@Req() req:Request): Csrf {
        // req.csrfToken()でcsrfTokenを取得できる
        return {csrfToken: req.csrfToken()}
    }

    // ユーザーの作成のエンドポイント
    @Post('signup')
    signUp(@Body() dto: AuthDto) : Promise<Msg> { // @Body()でリクエストボディを取得することができる　dtoにはAuthDto型のリクエストボディが格納される
        return this.authService.signUp(dto) // controllerの役割はルーティングのみを行う、serviceにビジネスロジックを受託する
    }

    // ログインのエンドポイント
    // nest.jsのpostはデフォルトで201のCreatedを返すが、ログインは何かを作成するわけではないので200のOKを返すようにする
    @HttpCode(HttpStatus.OK) // 200のOKを返す
    @Post('login')
    async login(
        @Body() dto: AuthDto, // リクエストボディを取得
        @Res({ passthrough: true }) res: Response, 
        // レスポンスを取得, res: Responseはcookieを保存するために使用, passthrough: trueはレスポンスを変更するために必要
    ) : Promise<Msg> {
        // authServiceのloginメソッドを実行
        const jwt = await this.authService.login(dto)

        // cookieにjwtを保存
        res.cookie('access_token', jwt.access_token, {
            // cookieのoptionを設定
            httpOnly: true,     // クライアントからcookieにアクセスできないようにする
            secure: true,       // httpsでのみcookieを送信する
            sameSite: 'none',   // CSRF対策のために必要
            path: '/'           // cookieの有効範囲を全てにする
        }) 

        return {
            message: 'ログインしました'
        } as Msg
    }

    // ログアウトのエンドポイント
    @HttpCode(HttpStatus.OK)
    @Post('logout')
    logout(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
        ): Msg {
            res.cookie('access_token', '', {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                path: '/'
            })

            return {
                message: 'ログアウトしました'
            } as Msg
        }
}

// auth.controller.ts and auth.service.ts で使用するデータ型を定義する

export interface Msg {
    message: string;
}

export interface Csrf {
    csrfToken: string;
}

export interface Jwt {
    access_token: string;
}
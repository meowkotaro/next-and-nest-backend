import { User } from "@prisma/client";

// expressのRequestにuserを追加して型を定義する
declare module "express-serve-static-core" {
    interface Request {
        user?: Omit<User, 'hashedPassword'>
    }
}
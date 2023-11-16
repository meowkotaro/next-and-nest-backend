import { Injectable } from '@nestjs/common';

@Injectable() // これをつけることで他のServiceやControllerに注入できる
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * Controller内の実装で、AppServiceをインスタンス化しない。
 * その代わりにDIを使用する。
 * Next.jsではConstructorに指定されたAppServiceのIoC Containerでインスタンス化して
 * AppControllerに注入する。
 * 生成されたAppServiceのインスタンスは、cacheされて再利用される。
 * AppController内で、注入されたAppServiceのメソッドを使用できる。
 */
@Controller() // ()内にstringの型でpathを設定できる
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get() // こちらはGET method ()内にpathを設定できる
  getHello(): string {
    return this.appService.getHello();
  }
}

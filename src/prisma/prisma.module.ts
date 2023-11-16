import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],   // PrismaServiceをprovidersに設定することで、PrismaServiceをインジェクションできるようになる。
  exports: [PrismaService],     // 他のモジュールでPrismaServiceを使用できるようにするために、exportsにPrismaServiceを設定する。
})
export class PrismaModule {}

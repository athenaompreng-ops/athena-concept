import { Module } from '@nestjs/common';
import { ShieldController } from './shield.controller';
import { ShieldService } from './shield.service';

@Module({
  controllers: [ShieldController],
  providers: [ShieldService],
  exports: [ShieldService],
})
export class ShieldModule {}

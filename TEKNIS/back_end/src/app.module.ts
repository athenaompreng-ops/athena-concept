import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { ShieldModule } from './shield/shield.module';
import { CreditModule } from './credit/credit.module';
import { ScoreModule } from './score/score.module';

@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Feature modules
    HealthModule,
    AuthModule,
    ShieldModule,
    CreditModule,
    ScoreModule,
  ],
})
export class AppModule {}

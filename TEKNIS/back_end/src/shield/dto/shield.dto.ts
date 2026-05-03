import {
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ShieldType {
  ANTI_AI = 'anti_ai',
  ANTI_NSFW = 'anti_nsfw',
  ANTI_DEEPFAKE = 'anti_deepfake',
  ANTI_TRAINING = 'anti_training',
  FULL = 'full',
}

export enum ProcessingTier {
  FREE = 'free',
  CREDIT = 'credit',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

export enum JobStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export class ProcessShieldDto {
  @ApiProperty({
    description: 'Jenis 4A Shield yang diaplikasikan',
    enum: ShieldType,
    example: ShieldType.FULL,
  })
  @IsEnum(ShieldType)
  shield_type: ShieldType;

  @ApiPropertyOptional({
    description: 'Resolusi maksimal output (px). Default sesuai tier.',
    example: 1080,
    minimum: 480,
    maximum: 8192,
  })
  @IsOptional()
  @IsNumber()
  @Min(480)
  @Max(8192)
  max_resolution?: number;
}

export class JobResponseDto {
  @ApiProperty({
    description: 'ID unik job',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  job_id: string;

  @ApiProperty({
    description: 'Status pemrosesan saat ini',
    enum: JobStatus,
    example: JobStatus.PENDING,
  })
  status: JobStatus;

  @ApiProperty({
    description: 'Tier pemrosesan',
    enum: ProcessingTier,
    example: ProcessingTier.FREE,
  })
  tier: ProcessingTier;

  @ApiProperty({
    description: 'Jenis shield yang diterapkan',
    enum: ShieldType,
    example: ShieldType.FULL,
  })
  shield_type: ShieldType;

  @ApiProperty({ example: '2026-05-03T07:00:00.000Z' })
  created_at: string;

  @ApiPropertyOptional({
    description: 'Estimasi waktu selesai (detik)',
    example: 45,
  })
  estimated_seconds?: number;
}

export class ShieldResultDto {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  job_id: string;

  @ApiProperty({ enum: JobStatus, example: JobStatus.COMPLETED })
  status: JobStatus;

  @ApiProperty({
    description: 'Shield Hash untuk verifikasi publik',
    example: 'athena_sh_7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
  })
  shield_hash: string;

  @ApiPropertyOptional({
    description: 'URL download foto terproteksi (presigned, berlaku 1 jam)',
    example: 'https://r2.athena.id/protected/f47ac10b...?token=...',
  })
  download_url?: string;

  @ApiProperty({
    description: 'Metrik perturbasi yang diterapkan',
    example: {
      epsilon: 8,
      l_inf_norm: 0.031,
      models_attacked: ['ResNet-50', 'VGG-19', 'ViT-B/16'],
      compression_aware: true,
      athena_seal_embedded: true,
    },
  })
  metrics: Record<string, any>;

  @ApiProperty({ example: 32.5 })
  processing_time_seconds: number;
}

export class VerifyShieldDto {
  @ApiProperty({
    description: 'Shield Hash yang ingin diverifikasi',
    example: 'athena_sh_7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
  })
  shield_hash: string;
}

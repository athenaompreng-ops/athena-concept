import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
} from '@nestjs/swagger';
import { ShieldService } from './shield.service';
import {
  ProcessShieldDto,
  JobResponseDto,
  ShieldResultDto,
} from './dto/shield.dto';

@ApiTags('Shield')
@Controller('shield')
export class ShieldController {
  constructor(private readonly shieldService: ShieldService) {}

  @Post('process')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Proses 4A Shield',
    description: `
Upload foto dan mulai pemrosesan 4A Shield. 

**Free Tier**: Pemrosesan dilakukan client-side (TensorFlow.js) — endpoint ini tidak dipanggil.  
**Credit/Pro Tier**: Foto dienkripsi (AES-256), masuk priority queue (BullMQ), diproses server-side dengan CA-PGD + ensemble model.

Shield types yang tersedia:
- \`anti_ai\` — Blocking facial recognition
- \`anti_nsfw\` — Mencegah manipulasi NSFW
- \`anti_deepfake\` — Disrupting deepfake synthesis
- \`anti_training\` — Dataset poisoning untuk IP budaya lokal
- \`full\` — Semua 4A Shield aktif (rekomendasi)
    `.trim(),
  })
  @ApiResponse({
    status: 201,
    description: 'Job berhasil dibuat dan masuk antrian',
    type: JobResponseDto,
  })
  @ApiResponse({ status: 400, description: 'File tidak valid atau format tidak didukung' })
  @ApiResponse({ status: 401, description: 'Token tidak valid' })
  @ApiResponse({ status: 402, description: 'Kredit tidak mencukupi' })
  @ApiResponse({ status: 413, description: 'File terlalu besar (maks. 20MB)' })
  async processShield(@Body() dto: ProcessShieldDto) {
    return this.shieldService.processShield(dto, 'placeholder-user-id');
  }

  @Get('status/:jobId')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Cek Status Job',
    description:
      'Cek status pemrosesan berdasarkan job ID. Untuk real-time update, gunakan WebSocket connection di `ws://[host]/shield`.',
  })
  @ApiParam({
    name: 'jobId',
    description: 'UUID dari job yang ingin dicek',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiResponse({
    status: 200,
    description: 'Status job saat ini',
    type: JobResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Job tidak ditemukan' })
  async getJobStatus(@Param('jobId') jobId: string) {
    return this.shieldService.getJobStatus(jobId);
  }

  @Get('verify/:hash')
  @ApiOperation({
    summary: 'Verifikasi Shield Hash (Publik)',
    description: `
Endpoint publik untuk memverifikasi Shield Hash. Siapapun bisa mengecek apakah:
- Hash valid (foto pernah diproses ATHENA)
- Foto asli sudah dihapus dari server
- Timestamp verifikasi terakhir

**Ini adalah implementasi dari arsitektur kepercayaan ATHENA** — "jangan percaya siapapun, verifikasi sendiri."
    `.trim(),
  })
  @ApiParam({
    name: 'hash',
    description: 'ATHENA Shield Hash',
    example: 'athena_sh_7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
  })
  @ApiResponse({
    status: 200,
    description: 'Hasil verifikasi Shield Hash',
    schema: {
      type: 'object',
      properties: {
        valid: { type: 'boolean', example: true },
        shield_hash: { type: 'string' },
        verified_at: { type: 'string' },
        original_deleted: { type: 'boolean', example: true },
        deletion_verified_at: { type: 'string' },
        shield_type: { type: 'string', example: 'full' },
        compression_aware: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Shield Hash tidak ditemukan' })
  async verifyShieldHash(@Param('hash') hash: string) {
    return this.shieldService.verifyShieldHash(hash);
  }
}

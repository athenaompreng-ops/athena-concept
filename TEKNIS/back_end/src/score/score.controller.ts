import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Score')
@Controller('score')
export class ScoreController {
  @Get('overview')
  @ApiOperation({
    summary: 'ATHENA Score — Overview (Publik)',
    description: `
Dashboard publik real-time yang menampilkan dampak kolektif komunitas ATHENA.

Data yang ditampilkan:
- Jumlah total foto yang sudah diproteksi
- Estimasi persentase konten Indonesia yang "beracun" bagi model AI
- Jumlah Shield Hash yang terverifikasi
- Total pengguna aktif komunitas
    `.trim(),
  })
  @ApiResponse({
    status: 200,
    description: 'Data overview ATHENA Score',
    schema: {
      type: 'object',
      properties: {
        total_protected_photos: { type: 'number', example: 12450 },
        total_users: { type: 'number', example: 3200 },
        estimated_ai_impact_percent: { type: 'number', example: 0.003 },
        total_verified_hashes: { type: 'number', example: 8930 },
        photos_today: { type: 'number', example: 245 },
        top_shield_type: { type: 'string', example: 'full' },
        updated_at: { type: 'string', example: '2026-05-03T07:00:00.000Z' },
      },
    },
  })
  getOverview() {
    return {
      total_protected_photos: 12450,
      total_users: 3200,
      estimated_ai_impact_percent: 0.003,
      total_verified_hashes: 8930,
      photos_today: 245,
      top_shield_type: 'full',
      updated_at: new Date().toISOString(),
    };
  }

  @Get('leaderboard')
  @ApiOperation({
    summary: 'Leaderboard Komunitas (Publik)',
    description:
      'Ranking komunitas paling aktif dalam melindungi karya. Gamifikasi sosial yang mendorong partisipasi viral.',
  })
  @ApiResponse({
    status: 200,
    description: 'Top 10 komunitas',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          rank: { type: 'number' },
          community: { type: 'string' },
          city: { type: 'string' },
          photos_protected: { type: 'number' },
          members: { type: 'number' },
        },
      },
    },
  })
  getLeaderboard() {
    return [
      { rank: 1, community: 'Batik Pekalongan', city: 'Pekalongan', photos_protected: 2340, members: 156 },
      { rank: 2, community: 'Tenun Ikat Flores', city: 'Ende', photos_protected: 1890, members: 98 },
      { rank: 3, community: 'Kreator Bandung', city: 'Bandung', photos_protected: 1560, members: 245 },
      { rank: 4, community: 'Ukiran Jepara', city: 'Jepara', photos_protected: 1200, members: 87 },
      { rank: 5, community: 'Songket Palembang', city: 'Palembang', photos_protected: 980, members: 63 },
    ];
  }
}

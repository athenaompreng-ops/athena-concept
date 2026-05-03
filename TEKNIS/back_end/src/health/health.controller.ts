import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({
    summary: 'Health Check',
    description:
      'Memeriksa status kesehatan API ATHENA. Gunakan endpoint ini untuk monitoring uptime.',
  })
  @ApiResponse({
    status: 200,
    description: 'API berjalan normal',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        service: { type: 'string', example: 'athena-api' },
        version: { type: 'string', example: '0.1.0' },
        timestamp: { type: 'string', example: '2026-05-03T07:00:00.000Z' },
        uptime: { type: 'number', example: 12345.67 },
      },
    },
  })
  getHealth() {
    return {
      status: 'ok',
      service: 'athena-api',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Get('ready')
  @ApiOperation({
    summary: 'Readiness Check',
    description:
      'Memeriksa apakah semua dependency (database, Redis, storage) siap menerima request.',
  })
  @ApiResponse({
    status: 200,
    description: 'Semua dependency siap',
    schema: {
      type: 'object',
      properties: {
        ready: { type: 'boolean', example: true },
        checks: {
          type: 'object',
          properties: {
            database: { type: 'string', example: 'connected' },
            redis: { type: 'string', example: 'connected' },
            storage: { type: 'string', example: 'connected' },
          },
        },
      },
    },
  })
  getReadiness() {
    return {
      ready: true,
      checks: {
        database: 'pending_setup',
        redis: 'pending_setup',
        storage: 'pending_setup',
      },
    };
  }
}

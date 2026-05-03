import { Controller, Post, Get, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, AuthResponseDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Registrasi User Baru',
    description:
      'Membuat akun baru via Supabase Auth. User baru otomatis mendapat tier Free dengan 5 foto/hari.',
  })
  @ApiResponse({
    status: 201,
    description: 'Registrasi berhasil',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validasi gagal' })
  @ApiResponse({ status: 409, description: 'Email sudah terdaftar' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login',
    description:
      'Autentikasi user dan dapatkan JWT access token + refresh token dari Supabase Auth.',
  })
  @ApiResponse({
    status: 200,
    description: 'Login berhasil',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Email atau password salah' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Profil User',
    description:
      'Mengambil profil user yang sedang login berdasarkan JWT token. Termasuk saldo kredit dan tier aktif.',
  })
  @ApiResponse({
    status: 200,
    description: 'Profil user',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        },
        email: { type: 'string', example: 'kreator@example.com' },
        name: { type: 'string', example: 'Siti Rahayu' },
        role: {
          type: 'string',
          enum: ['free', 'credit', 'pro', 'enterprise'],
          example: 'free',
        },
        credit_balance: { type: 'number', example: 5 },
        daily_free_count: { type: 'number', example: 2 },
        created_at: { type: 'string', example: '2026-05-03T07:00:00.000Z' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Token tidak valid atau expired' })
  async getProfile() {
    return this.authService.getProfile('placeholder-user-id');
  }
}

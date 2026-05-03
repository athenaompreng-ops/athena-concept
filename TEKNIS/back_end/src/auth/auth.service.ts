import { Injectable } from '@nestjs/common';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  /**
   * Registrasi user baru via Supabase Auth.
   * TODO: Integrasi Supabase Auth SDK
   */
  async register(dto: RegisterDto) {
    // Placeholder — akan diintegrasikan dengan Supabase Auth
    return {
      access_token: 'placeholder_jwt_token',
      refresh_token: 'placeholder_refresh_token',
      user: {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        email: dto.email,
        name: dto.name,
        role: 'free',
        credit_balance: 0,
      },
    };
  }

  /**
   * Login user dan dapatkan JWT token.
   * TODO: Integrasi Supabase Auth SDK
   */
  async login(dto: LoginDto) {
    return {
      access_token: 'placeholder_jwt_token',
      refresh_token: 'placeholder_refresh_token',
      user: {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        email: dto.email,
        name: 'User Name',
        role: 'free',
        credit_balance: 0,
      },
    };
  }

  /**
   * Ambil profil user dari JWT token.
   * TODO: Decode JWT dan query Supabase
   */
  async getProfile(userId: string) {
    return {
      id: userId,
      email: 'kreator@example.com',
      name: 'Siti Rahayu',
      role: 'free',
      credit_balance: 5,
      daily_free_count: 2,
      created_at: new Date().toISOString(),
    };
  }
}

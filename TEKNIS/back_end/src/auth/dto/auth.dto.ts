import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Alamat email pengguna',
    example: 'kreator@example.com',
  })
  @IsEmail({}, { message: 'Format email tidak valid' })
  email: string;

  @ApiProperty({
    description: 'Password minimal 8 karakter',
    example: 'SecurePass123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  password: string;

  @ApiProperty({
    description: 'Nama lengkap pengguna',
    example: 'Siti Rahayu',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  name: string;
}

export class LoginDto {
  @ApiProperty({
    description: 'Alamat email terdaftar',
    example: 'kreator@example.com',
  })
  @IsEmail({}, { message: 'Format email tidak valid' })
  email: string;

  @ApiProperty({
    description: 'Password akun',
    example: 'SecurePass123!',
  })
  @IsString()
  password: string;
}

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  access_token: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  refresh_token: string;

  @ApiProperty({
    example: {
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      email: 'kreator@example.com',
      name: 'Siti Rahayu',
      role: 'free',
      credit_balance: 0,
    },
  })
  user: Record<string, any>;
}

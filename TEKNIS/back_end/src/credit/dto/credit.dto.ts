import { IsEnum, IsNumber, Min, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum CreditPackage {
  STARTER = 'starter',
  VALUE = 'value',
  BULK = 'bulk',
}

export class PurchaseCreditDto {
  @ApiProperty({
    description: 'Paket kredit yang dibeli',
    enum: CreditPackage,
    example: CreditPackage.STARTER,
  })
  @IsEnum(CreditPackage)
  package: CreditPackage;
}

export class CreditBalanceDto {
  @ApiProperty({ example: 45 })
  balance: number;

  @ApiProperty({ example: 'credit' })
  tier: string;

  @ApiProperty({
    example: [
      { package: 'starter', credits: 50, price: 5000 },
      { package: 'value', credits: 150, price: 12000 },
      { package: 'bulk', credits: 300, price: 20000 },
    ],
  })
  available_packages: Array<{
    package: string;
    credits: number;
    price: number;
  }>;
}

import { Controller, Get, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreditService } from './credit.service';
import { PurchaseCreditDto, CreditBalanceDto } from './dto/credit.dto';

@ApiTags('Credits')
@ApiBearerAuth('access-token')
@Controller('credits')
export class CreditController {
  constructor(private readonly creditService: CreditService) {}

  @Get('balance')
  @ApiOperation({
    summary: 'Cek Saldo Kredit',
    description:
      'Mengambil saldo kredit saat ini beserta daftar paket kredit yang tersedia untuk dibeli.',
  })
  @ApiResponse({ status: 200, description: 'Saldo kredit', type: CreditBalanceDto })
  async getBalance() {
    return this.creditService.getBalance('placeholder-user-id');
  }

  @Post('purchase')
  @ApiOperation({
    summary: 'Beli Paket Kredit',
    description: `
Memulai pembelian kredit via Midtrans payment gateway.

**Paket tersedia:**
| Paket | Kredit | Harga |
|-------|--------|-------|
| starter | 50 foto | Rp 5.000 |
| value | 150 foto | Rp 12.000 |
| bulk | 300 foto | Rp 20.000 |

Kredit berlaku **90 hari** sejak pembelian. Mendukung QRIS, GoPay, OVO, dan kartu kredit/debit.
    `.trim(),
  })
  @ApiResponse({
    status: 201,
    description: 'Order berhasil dibuat, redirect ke payment gateway',
    schema: {
      type: 'object',
      properties: {
        order_id: { type: 'string', example: 'athena_1714700000000' },
        package: { type: 'string', example: 'starter' },
        credits: { type: 'number', example: 50 },
        price: { type: 'number', example: 5000 },
        currency: { type: 'string', example: 'IDR' },
        payment_url: { type: 'string', example: 'https://app.sandbox.midtrans.com/snap/...' },
        expires_at: { type: 'string' },
      },
    },
  })
  async purchaseCredit(@Body() dto: PurchaseCreditDto) {
    return this.creditService.purchaseCredit(dto, 'placeholder-user-id');
  }

  @Get('history')
  @ApiOperation({
    summary: 'Riwayat Transaksi Kredit',
    description:
      'Mengambil riwayat semua transaksi kredit (pembelian, pemakaian, refund, bonus).',
  })
  @ApiResponse({
    status: 200,
    description: 'Daftar transaksi kredit',
  })
  async getHistory() {
    return this.creditService.getHistory('placeholder-user-id');
  }
}

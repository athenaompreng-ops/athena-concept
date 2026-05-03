import { Injectable } from '@nestjs/common';
import { PurchaseCreditDto, CreditPackage } from './dto/credit.dto';

const PACKAGES = {
  [CreditPackage.STARTER]: { credits: 50, price: 5000 },
  [CreditPackage.VALUE]: { credits: 150, price: 12000 },
  [CreditPackage.BULK]: { credits: 300, price: 20000 },
};

@Injectable()
export class CreditService {
  async getBalance(userId: string) {
    return {
      balance: 45,
      tier: 'credit',
      available_packages: Object.entries(PACKAGES).map(([key, val]) => ({
        package: key,
        ...val,
      })),
    };
  }

  async purchaseCredit(dto: PurchaseCreditDto, userId: string) {
    const pkg = PACKAGES[dto.package];
    return {
      order_id: `athena_${Date.now()}`,
      package: dto.package,
      credits: pkg.credits,
      price: pkg.price,
      currency: 'IDR',
      payment_url: 'https://app.sandbox.midtrans.com/snap/v3/redirect/placeholder',
      expires_at: new Date(Date.now() + 3600000).toISOString(),
    };
  }

  async getHistory(userId: string) {
    return {
      transactions: [
        {
          id: 'tx_001',
          type: 'purchase',
          amount: 50,
          balance_after: 50,
          description: 'Pembelian paket Starter (50 kredit)',
          created_at: '2026-05-01T10:00:00.000Z',
        },
        {
          id: 'tx_002',
          type: 'consume',
          amount: -5,
          balance_after: 45,
          description: '5 foto diproses dengan 4A Shield Full',
          created_at: '2026-05-02T14:30:00.000Z',
        },
      ],
      total: 2,
    };
  }
}

export type TxStatus = 'settled' | 'processing' | 'failed' | 'refunded' | 'pending';

export const ALL_STATUSES: TxStatus[] = ['settled', 'processing', 'failed', 'refunded', 'pending'];

export type Currency = 'GBP' | 'USD' | 'EUR' | 'HKD' | 'AED' | 'SAR';

export const ALL_CURRENCIES: Currency[] = ['GBP', 'USD', 'EUR', 'HKD', 'AED', 'SAR'];

export interface TimelineEvent {
  at: string; // ISO 8601
  status: TxStatus;
  note: string;
}

export interface Transaction {
  id: string;
  amount: number;
  fee: number;
  currency: Currency;
  status: TxStatus;
  counterparty: string;
  createdAt: string; // ISO 8601
  reference: string;
  timeline: TimelineEvent[];
  refund?: { kind: 'full' | 'partial'; amount: number; feeReturned: number };
}

// Deterministic fictional dataset — every counterparty is invented for this concept demo.
const COUNTERPARTIES: Record<Currency, string[]> = {
  GBP: ['Northgate Textiles Ltd', 'Cambridge Micro Brewery', 'Alba Freight Co', 'Wren & Field Studio', 'Meridian Parts UK', 'Solent Marine Supply', 'Harrowgate Legal LLP'],
  USD: ['Blue Heron Analytics', 'Cascade Outdoor Gear', 'Pilotfish Media Inc', 'Juniper Payroll Services', 'Harborline Logistics', 'Mesa Verde Solar', 'Ironwood Furniture Co'],
  EUR: ['Atelier Moreau SARL', 'Nordwind Maschinen GmbH', 'Lisboa Cork Traders', 'Fiore Ceramiche SRL', 'Baltic Design Oy', 'Alpen Kaffee Rösterei', 'Sevilla Citrus Export'],
  HKD: ['Kowloon Circuit House', 'Pearl Delta Sourcing', 'Lantern Peak Games', 'Victoria Harbour Foods', 'Taipa Print Works', 'Golden Bauhinia Optics', 'Sheung Wan Tea Merchants'],
  AED: ['Falcon Gate Trading', 'Marina Pearl Hospitality', 'Dune Crest Fittings', 'Oasis Cloud Services', 'Sharjah Amber Retail', 'Corniche Event Group', 'Jumeirah Thread Mills'],
  SAR: ['Riyadh Crescent Pharma', 'Jeddah Palm Imports', 'Najd Stone Works', 'Red Sea Cable Co', 'Qassim Date Growers', 'Diriyah Marble House', 'Khobar Valve Systems'],
};

const STATUS_CYCLE: TxStatus[] = [
  'settled', 'processing', 'settled', 'pending', 'settled', 'failed', 'settled', 'refunded',
  'processing', 'settled', 'pending', 'settled', 'failed', 'settled', 'refunded', 'settled',
  'processing', 'settled', 'pending', 'settled',
];

// All six demo currencies use two decimal places. Generate canonical cents before fees.
function buildAmount(i: number): number {
  return Math.round((137.5 + ((i * 7919) % 420000)) / 10) / 100;
}

function buildFee(amount: number, i: number): number {
  const pct = 0.006 + ((i * 13) % 25) / 1000; // 0.6% – 3.0%
  const flat = 0.2 + ((i * 7) % 12) / 10;
  return Math.round((amount * pct + flat) * 100) / 100;
}

function timelineFor(status: TxStatus, created: Date, partialRefund: boolean): TimelineEvent[] {
  const base: TimelineEvent[] = [
    { at: created.toISOString(), status: 'pending', note: 'Instruction received and validated' },
  ];
  const plus = (minutes: number) => new Date(created.getTime() + minutes * 60_000).toISOString();
  switch (status) {
    case 'settled':
      base.push(
        { at: plus(4), status: 'processing', note: 'Sent to payout network' },
        { at: plus(61), status: 'settled', note: 'Funds confirmed by beneficiary bank' },
      );
      break;
    case 'processing':
      base.push({ at: plus(4), status: 'processing', note: 'Sent to payout network' });
      break;
    case 'failed':
      base.push(
        { at: plus(4), status: 'processing', note: 'Sent to payout network' },
        { at: plus(38), status: 'failed', note: 'Rejected: beneficiary account name mismatch' },
      );
      break;
    case 'refunded':
      base.push(
        { at: plus(4), status: 'processing', note: 'Sent to payout network' },
        { at: plus(55), status: 'settled', note: 'Funds confirmed by beneficiary bank' },
        { at: plus(60 * 26), status: 'refunded', note: partialRefund ? 'Partial refund issued at sender request' : 'Full refund issued at sender request' },
      );
      break;
    case 'pending':
      break;
  }
  return base;
}

const NOW = Date.UTC(2026, 9, 15, 9, 30, 0); // fixed anchor keeps the demo reproducible

export const transactions: Transaction[] = ALL_CURRENCIES.flatMap((currency, ci) => {
  const names = COUNTERPARTIES[currency];
  return names.map((counterparty, ni) => {
    const i = ci * names.length + ni;
    const status = STATUS_CYCLE[i % STATUS_CYCLE.length];
    const created = new Date(NOW - i * 26 * 3_600_000 - ni * 3_700_000);
    const amount = buildAmount(i + 3);
    const fee = buildFee(amount, i);
    return {
      id: `tx-${String(i + 1).padStart(3, '0')}`,
      amount,
      fee,
      currency,
      status,
      counterparty,
      createdAt: created.toISOString(),
      reference: `PAY-2026-${String(10420 + i * 37)}`,
      timeline: timelineFor(status, created, i % 2 === 0),
      refund: status === 'refunded' ? { kind: i % 2 === 0 ? 'partial' : 'full', amount: i % 2 === 0 ? Math.round(amount * 100 / 2) / 100 : amount, feeReturned: 0 } : undefined,
    };
  });
});

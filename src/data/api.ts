import { transactions, type Transaction } from './transactions';

export const SIMULATED_LATENCY_MS = 600;
export type DemoScenario = 'none' | 'loading' | 'empty' | 'long-text' | 'network' | 'forbidden' | 'expired';
export type ApiErrorCode = 'network' | 'forbidden' | 'expired';
export const longTextTransactions: Transaction[] = transactions.map((tx, index) => index === 0 ? {
  ...tx,
  counterparty: 'Northgate International Settlement and Cross-Border Treasury Operations — Europe, Middle East and Asia Pacific Division',
  reference: 'DEMO-REFERENCE-WITHOUT-SPACES-ABCDEFGHIJKLMNOPQRSTUVWXYZ-0123456789-ABCDEFGHIJKLMNOPQRSTUVWXYZ',
} : tx);
export class ApiError extends Error {
  code: ApiErrorCode;
  constructor(code: ApiErrorCode = 'network') {
    super(code);
    this.code = code;
    this.name = 'ApiError';
  }
}

/** Local simulation only; no authentication or permission changes are performed. */
export function fetchTransactions(options: { scenario?: DemoScenario; simulateError?: boolean } = {}): Promise<Transaction[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const scenario = options.scenario ?? (options.simulateError ? 'network' : 'none');
      if (scenario === 'network' || scenario === 'forbidden' || scenario === 'expired') reject(new ApiError(scenario));
      else if (scenario === 'empty') resolve([]);
      else resolve(scenario === 'long-text' ? longTextTransactions : transactions);
    }, SIMULATED_LATENCY_MS);
  });
}

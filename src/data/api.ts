import { transactions, type Transaction } from './transactions';

export const SIMULATED_LATENCY_MS = 600;
export type DemoScenario = 'none' | 'network' | 'forbidden' | 'expired';
export class ApiError extends Error {
  code: Exclude<DemoScenario, 'none'>;
  constructor(code: Exclude<DemoScenario, 'none'> = 'network') {
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
      if (scenario !== 'none') reject(new ApiError(scenario));
      else resolve(transactions);
    }, SIMULATED_LATENCY_MS);
  });
}

/** Decimal half-away-from-zero rounding at the display boundary; integer minor-unit arithmetic. */
export function toMinorUnits(value: number, currency: string): number | null {
  if (!Number.isFinite(value) || !/^[A-Z]{3}$/.test(currency)) return null;
  try {
    const digits = new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2;
    const [coefficient, exponent = '0'] = Math.abs(value).toString().toLowerCase().split('e');
    const [whole, fraction = ''] = coefficient.split('.');
    const shift = Number(exponent) - fraction.length + digits;
    const integer = BigInt(whole + fraction);
    const divisor = shift < 0 ? 10n ** BigInt(-shift) : 1n;
    const rounded = shift >= 0 ? integer * 10n ** BigInt(shift) : (integer + divisor / 2n) / divisor;
    if (rounded > BigInt(Number.MAX_SAFE_INTEGER)) return null;
    return Number(rounded) * (value < 0 ? -1 : 1) || 0;
  } catch { return null; }
}

export function addMoney(currency: string, ...values: number[]): number {
  const units = values.map(value => toMinorUnits(value, currency));
  if (units.some(value => value === null)) return NaN;
  const sum = units.reduce<bigint>((total, value) => total + BigInt(value!), 0n);
  if (sum > BigInt(Number.MAX_SAFE_INTEGER) || sum < BigInt(-Number.MAX_SAFE_INTEGER)) return NaN;
  const digits = new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2;
  return Number(sum) / 10 ** digits;
}

/** Display-only formatting. Never use these numbers to execute a payment. */
export function formatMoney(value: number, currency: string, locale: string): string | null {
  if (!Number.isFinite(value) || !/^[A-Z]{3}$/.test(currency)) return null;
  try {
    const formatter = new Intl.NumberFormat(locale, { style: 'currency', currency, currencyDisplay: 'code' });
    const digits = formatter.resolvedOptions().maximumFractionDigits ?? 2;
    if (Math.abs(value) * 10 ** digits > Number.MAX_SAFE_INTEGER) return null;
    const units = toMinorUnits(value, currency);
    return units === null ? null : formatter.format(units / 10 ** digits);
  } catch {
    return null;
  }
}

/** Group unlike currencies instead of implying an FX-adjusted value order. */
export function compareMoney(a: { currency: string; amount: number }, b: { currency: string; amount: number }): number {
  return a.currency.localeCompare(b.currency) || a.amount - b.amount;
}

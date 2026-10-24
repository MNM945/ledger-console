import { intlLocale, useI18n } from '../i18n';
import { addMoney, formatMoney } from '../money';

interface MoneyTextProps {
  amount: number;
  currency: string;
  /** When provided with `showBreakdown`, renders amount + fee = total. */
  fee?: number;
  showBreakdown?: boolean;
  className?: string;
}

/**
 * Currency-aware money rendering via Intl.NumberFormat.
 * Explicit currency codes disambiguate markets in visible and accessible text.
 * Bidirectional isolation keeps the formatted value intact inside RTL content.
 */
export function MoneyText({ amount, currency, fee, showBreakdown = false, className }: MoneyTextProps) {
  const { locale, t } = useI18n();
  const tag = intlLocale(locale);
  const formatted = formatMoney(amount, currency, tag);
  const formattedFee = fee === undefined ? null : formatMoney(fee, currency, tag);
  const formattedTotal = fee === undefined ? null : formatMoney(addMoney(currency, amount, fee), currency, tag);
  if (formatted === null || (showBreakdown && fee !== undefined && (formattedFee === null || formattedTotal === null))) {
    return <span className={`money ${className ?? ''}`}>{t.moneyUnavailable}</span>;
  }

  if (!showBreakdown || fee === undefined) {
    return (
      <bdi className={`money ${className ?? ''}`} aria-label={formatted}>
        {formatted}
      </bdi>
    );
  }

  const spoken = `${t.amount} ${formatted}, ${t.fee} ${formattedFee}, ${t.total} ${formattedTotal}`;
  return (
    <span className={`money money--breakdown ${className ?? ''}`} aria-label={spoken}>
      <bdi className="money__total">{formattedTotal}</bdi>
      <span className="money__parts" aria-hidden="true">
        <bdi>{formatted} + {formattedFee}</bdi>
      </span>
    </span>
  );
}

import type { TxStatus } from '../data/transactions';
import { useI18n } from '../i18n';

// Status is never conveyed by color alone: every badge pairs a distinct glyph
// with a text label, and fg/bg token pairs are tuned to WCAG AA on both modes.
const GLYPHS: Record<TxStatus, string> = {
  settled: '✓',
  processing: '◔',
  failed: '✕',
  refunded: '↩',
  pending: '◷',
};

export function StatusBadge({ status }: { status: TxStatus }) {
  const { t } = useI18n();
  return (
    <span className={`badge badge--${status}`}>
      <span className="badge__icon" aria-hidden="true">
        {GLYPHS[status]}
      </span>
      {t.status[status]}
    </span>
  );
}

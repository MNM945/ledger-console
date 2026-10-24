import { Button } from './Controls';
import { useI18n } from '../i18n';

export function LoadingSkeleton({ rows = 6 }: { rows?: number }) {
  const { t } = useI18n();
  return (
    <div className="skeleton-wrap" aria-busy="true" aria-label={t.loading} role="status">
      <span className="visually-hidden">{t.loading}</span>
      {Array.from({ length: rows }, (_, i) => (
        <div className="skeleton-row" key={i} aria-hidden="true">
          <span className="skeleton-cell" style={{ width: '18%' }} />
          <span className="skeleton-cell" style={{ width: '30%' }} />
          <span className="skeleton-cell" style={{ width: '22%' }} />
          <span className="skeleton-cell" style={{ width: '14%' }} />
          <span className="skeleton-cell" style={{ width: '12%' }} />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ variant, onClearFilters }: { variant: 'no-data' | 'no-results'; onClearFilters?: () => void }) {
  const { t } = useI18n();
  const isNoData = variant === 'no-data';
  return (
    <div className="state-view" role="status">
      <span className="state-view__icon" aria-hidden="true">
        {isNoData ? '▤' : '⌕'}
      </span>
      <h2 className="state-view__title">{isNoData ? t.emptyNoDataTitle : t.emptyFilteredTitle}</h2>
      <p className="state-view__body">{isNoData ? t.emptyNoDataBody : t.emptyFilteredBody}</p>
      {!isNoData && onClearFilters && (
        <Button type="button" className="btn" onClick={onClearFilters}>
          {t.clearFilters}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({ onRetry, kind = 'network' }: { onRetry: () => void; kind?: 'network' | 'forbidden' | 'expired' }) {
  const { t } = useI18n();
  const title = kind === 'forbidden' ? t.forbiddenTitle : kind === 'expired' ? t.expiredTitle : t.errorTitle;
  const body = kind === 'forbidden' ? t.forbiddenBody : kind === 'expired' ? t.expiredBody : t.errorBody;
  const action = kind === 'forbidden' ? t.checkDemoAccess : kind === 'expired' ? t.restoreDemoSession : t.retry;
  return (
    <div className="state-view state-view--error" role="alert">
      <span className="state-view__icon" aria-hidden="true">
        ⚠
      </span>
      <h2 className="state-view__title">{title}</h2>
      <p className="state-view__body">{body}</p>
      <Button type="button" className="btn btn--primary" onClick={onRetry}>
        {action}
      </Button>
    </div>
  );
}

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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          {kind==='forbidden'?<><rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><path d="M12 14v3"/></>:kind==='expired'?<><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/></>:<><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5"/><circle cx="12" cy="16" r=".8" fill="currentColor" stroke="none"/></>}
        </svg>
      </span>
      <h2 className="state-view__title">{title}</h2>
      <p className="state-view__body">{body}</p>
      <Button type="button" className="btn btn--primary" onClick={onRetry}>
        {action}
      </Button>
    </div>
  );
}

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ApiError, fetchTransactions, type DemoScenario } from './data/api';
import type { Transaction } from './data/transactions';
import { I18nProvider, useI18n, type Direction, type Locale } from './i18n';
import { FilterBar, type FilterState } from './components/FilterBar';
import { TransactionTable, type SortState } from './components/TransactionTable';
import { TransactionDrawer } from './components/TransactionDrawer';
import { EmptyState, ErrorState, LoadingSkeleton } from './components/StateViews';
import { DirectionToggle, LanguageSwitch } from './components/DirectionToggle';
import { compareMoney } from './money';
import { ThemeToggle, type Theme } from './components/ThemeToggle';

type LoadState = 'loading' | 'network' | 'forbidden' | 'expired' | 'ready';

const DEFAULT_FILTERS: FilterState = { statuses: [], currency: 'all', query: '' };

function Header({
  theme,
  onThemeToggle,
  locale,
  onLocaleChange,
  direction,
  onDirectionToggle,
  scenario,
  onScenarioChange,
}: {
  theme: Theme;
  onThemeToggle: () => void;
  locale: Locale;
  onLocaleChange: (l: Locale) => void;
  direction: Direction;
  onDirectionToggle: () => void;
  scenario: DemoScenario;
  onScenarioChange: (scenario: DemoScenario) => void;
}) {
  const { t } = useI18n();
  return (
    <header className="topbar">
      <div className="topbar__brand">
        <h1 className="topbar__title">{t.appTitle}</h1>
        <span className="topbar__badge">{t.conceptBadge}</span>
      </div>
      <div className="topbar__controls">
        <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        <LanguageSwitch locale={locale} onChange={onLocaleChange} />
        <DirectionToggle direction={direction} onToggle={onDirectionToggle} />
        <div className="field field--inline">
          <label className="field__label" htmlFor="demo-scenario">{t.demoScenario}</label>
          <select id="demo-scenario" className="field__input" value={scenario} onChange={e => onScenarioChange(e.target.value as DemoScenario)}>
            <option value="none">{t.scenarioReady}</option>
            <option value="network">{t.scenarioNetwork}</option>
            <option value="forbidden">{t.scenarioForbidden}</option>
            <option value="expired">{t.scenarioExpired}</option>
          </select>
        </div>
      </div>
    </header>
  );
}

function Console({ scenario, onRecover }: { scenario: DemoScenario; onRecover: () => void }) {
  const { t } = useI18n();
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [data, setData] = useState<Transaction[]>([]);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortState>({ key: 'createdAt', direction: 'desc' });
  const [selected, setSelected] = useState<Transaction | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const requestVersion = useRef(0);

  const load = useCallback((scenario: DemoScenario) => {
    const version = ++requestVersion.current;
    setLoadState('loading');
    setData([]);
    setSelected(null);
    fetchTransactions({ scenario })
      .then((txs) => {
        if (version !== requestVersion.current) return;
        setData(txs);
        setLoadState('ready');
      })
      .catch((error: unknown) => {
        if (version !== requestVersion.current) return;
        setData([]);
        setLoadState(error instanceof ApiError ? error.code : 'network');
      });
  }, []);

  useEffect(() => {
    load(scenario);
    return () => { requestVersion.current += 1; };
  }, [load, scenario]);

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    const rows = data.filter((tx) => {
      if (filters.statuses.length > 0 && !filters.statuses.includes(tx.status)) return false;
      if (filters.currency !== 'all' && tx.currency !== filters.currency) return false;
      if (q && !tx.counterparty.toLowerCase().includes(q) && !tx.reference.toLowerCase().includes(q)) return false;
      return true;
    });
    const dir = sort.direction === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      switch (sort.key) {
        case 'createdAt':
          return a.createdAt.localeCompare(b.createdAt) * dir;
        case 'counterparty':
          return a.counterparty.localeCompare(b.counterparty) * dir;
        case 'amount':
          return compareMoney(a, b) * dir;
        case 'status':
          return a.status.localeCompare(b.status) * dir;
      }
    });
  }, [data, filters, sort]);

  // Announce filtered result counts to screen readers without interrupting typing.
  useEffect(() => {
    if (loadState !== 'ready') {
      setAnnouncement('');
      return;
    }
    const id = setTimeout(() => setAnnouncement(t.announceResults(filtered.length)), 300);
    return () => clearTimeout(id);
  }, [filtered.length, loadState, t]);

  const filtersActive = filters.statuses.length > 0 || filters.currency !== 'all' || filters.query.trim() !== '';

  return (
    <main id="main" className="console__main">
      <div className="ledger-heading">
        <div><p className="ledger-eyebrow">{t.appTitle}</p><h2>{t.ledgerHeading}</h2><p>{t.ledgerDescription}</p></div>
        <span className="ledger-live">{t.demoData}</span>
      </div>
      <div className="ledger-summary">
        <article><span>{t.totalRecords}</span><strong>{loadState === 'ready' ? data.length : '—'}</strong><small>{t.allRecords}</small></article>
        <article><span>{t.currencies}</span><strong>{loadState === 'ready' ? new Set(data.map(tx => tx.currency)).size : '—'}</strong><small>GBP · USD · EUR · HKD · AED · SAR</small></article>
        <article><span>{t.status.processing}</span><strong>{loadState === 'ready' ? data.filter(tx => tx.status === 'processing').length : '—'}</strong><small>{t.allRecords}</small></article>
      </div>
      {loadState === 'ready' && <FilterBar value={filters} onChange={setFilters} />}

      <p className="result-count" aria-hidden="true">
        {loadState === 'ready' ? t.results(filtered.length) : ' '}
      </p>
      <div className="visually-hidden" aria-live="polite">
        {announcement}
      </div>

      {loadState === 'loading' && <LoadingSkeleton />}
      {(loadState === 'network' || loadState === 'forbidden' || loadState === 'expired') && <ErrorState kind={loadState} onRetry={onRecover} />}
      {loadState === 'ready' && filtered.length === 0 && (
        <EmptyState
          variant={filtersActive ? 'no-results' : 'no-data'}
          onClearFilters={() => setFilters(DEFAULT_FILTERS)}
        />
      )}
      {loadState === 'ready' && filtered.length > 0 && (
        <div className="table-scroll" tabIndex={0} role="region" aria-label={t.appTitle}>
          <TransactionTable
            transactions={filtered}
            sort={sort}
            onSortChange={setSort}
            onRowOpen={(tx, rowEl) => {
              returnFocusRef.current = rowEl;
              setSelected(tx);
            }}
          />
        </div>
      )}

      {selected && (
        <TransactionDrawer transaction={selected} onClose={() => setSelected(null)} returnFocusRef={returnFocusRef} />
      )}
    </main>
  );
}

function SkipLink() {
  const { t } = useI18n();
  return <a href="#main" className="skip-link">{t.skipToResults}</a>;
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('ledger-console-theme', theme); } catch { /* Theme still works when storage is unavailable. */ }
  }, [theme]);
  const [locale, setLocale] = useState<Locale>('en');
  const [direction, setDirection] = useState<Direction>('ltr');
  const [scenario, setScenario] = useState<DemoScenario>('none');

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
  }, [locale, direction]);

  const switchLocale = (next: Locale) => {
    setLocale(next);
    setDirection(next === 'ar' ? 'rtl' : 'ltr');
  };

  return (
    <I18nProvider locale={locale}>
      <SkipLink />
      <Header
        theme={theme}
        onThemeToggle={() => setTheme(current => current === 'dark' ? 'light' : 'dark')}
        locale={locale}
        onLocaleChange={switchLocale}
        direction={direction}
        onDirectionToggle={() => setDirection(direction === 'rtl' ? 'ltr' : 'rtl')}
        scenario={scenario}
        onScenarioChange={setScenario}
      />
      <Console scenario={scenario} onRecover={() => setScenario('none')} />
    </I18nProvider>
  );
}

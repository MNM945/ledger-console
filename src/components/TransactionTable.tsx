import type { Transaction } from '../data/transactions';
import { intlLocale, useI18n } from '../i18n';
import { MoneyText } from './MoneyText';
import { StatusBadge } from './StatusBadge';

export type SortKey = 'createdAt' | 'counterparty' | 'amount' | 'status';

export interface SortState {
  key: SortKey;
  direction: 'asc' | 'desc';
}

interface TransactionTableProps {
  transactions: Transaction[];
  sort: SortState;
  onSortChange: (next: SortState) => void;
  onRowOpen: (tx: Transaction, rowEl: HTMLElement) => void;
}

function formatDate(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }).format(new Date(iso)) + ' UTC';
}

export function TransactionTable({ transactions, sort, onSortChange, onRowOpen }: TransactionTableProps) {
  const { locale, t } = useI18n();
  const tag = intlLocale(locale);

  const columns: { key: SortKey | null; label: string; numeric?: boolean }[] = [
    { key: 'createdAt', label: t.colDate },
    { key: 'counterparty', label: t.colCounterparty },
    { key: null, label: t.colReference },
    { key: 'amount', label: t.colAmount, numeric: true },
    { key: null, label: t.colFee, numeric: true },
    { key: 'status', label: t.colStatus },
  ];

  const ariaSort = (key: SortKey): 'ascending' | 'descending' | undefined =>
    sort.key === key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined;

  const handleSort = (key: SortKey) => {
    onSortChange(
      sort.key === key
        ? { key, direction: sort.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: key === 'createdAt' ? 'desc' : 'asc' },
    );
  };

  const sortHint = (key: SortKey, label: string) =>
    sort.key === key
      ? `${t.sortBy} ${label}, ${sort.direction === 'asc' ? t.sortAscending : t.sortDescending}`
      : `${t.sortBy} ${label}`;

  return (
    <table className="tx-table">
      <thead>
        <tr>
          {columns.map(({ key, label, numeric }) => (
            <th
              key={label}
              scope="col"
              aria-sort={key ? ariaSort(key) : undefined}
              className={numeric ? 'num' : undefined}
            >
              {key ? (
                <button type="button" className={`th-sort ${key === 'amount' ? 'th-sort--amount' : ''}`} onClick={() => handleSort(key)} aria-label={sortHint(key, key === 'amount' ? t.amountSort : label)}>
                  {key === 'amount' ? t.amountSort : label}
                  <span className="th-sort__arrow" aria-hidden="true">
                    {sort.key === key ? (sort.direction === 'asc' ? '▲' : '▼') : '↕'}
                  </span>
                </button>
              ) : (
                label
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {transactions.map((tx) => (
          <tr
            key={tx.id}
            tabIndex={0}
            className="tx-row"
            aria-label={`${t.openDetails} ${tx.counterparty}, ${tx.reference}`}
            onClick={(e) => onRowOpen(tx, e.currentTarget)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onRowOpen(tx, e.currentTarget);
              }
            }}
          >
            <td className="nowrap">{formatDate(tx.createdAt, tag)}</td>
            <td>{tx.counterparty}</td>
            <td className="mono"><bdi>{tx.reference}</bdi></td>
            <td className="num">
              <MoneyText amount={tx.amount} currency={tx.currency} />
            </td>
            <td className="num">
              <MoneyText amount={tx.fee} currency={tx.currency} />
            </td>
            <td>
              <StatusBadge status={tx.status} />
              {tx.refund && <span className="refund-caption">{tx.refund.kind === 'partial' ? t.partialRefund : t.fullRefund}</span>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

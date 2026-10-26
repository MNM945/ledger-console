import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { I18nProvider } from '../i18n';
import { transactions, type Transaction } from '../data/transactions';
import { TransactionTable, type SortState } from '../components/TransactionTable';
import { EmptyState, ErrorState, LoadingSkeleton } from '../components/StateViews';
import { compareMoney } from '../money';
import { longTextTransactions } from '../data/api';

function TableDemo({ rows }: { rows: Transaction[] }) {
  const [sort, setSort] = useState<SortState>({ key: 'createdAt', direction: 'desc' });
  const direction = sort.direction === 'asc' ? 1 : -1;
  const sorted = [...rows].sort((a, b) => {
    if (sort.key === 'amount') return compareMoney(a, b) * direction;
    return a[sort.key].localeCompare(b[sort.key]) * direction;
  });
  return (
    <div className="table-scroll" role="region" tabIndex={0} aria-label="Transaction table example"><TransactionTable transactions={sorted} sort={sort} onSortChange={setSort} onRowOpen={() => {}} /></div>
  );
}

const meta = {
  title: 'Components/TransactionTable',
  component: TableDemo,
  decorators: [
    (Story, context) => (
      <I18nProvider locale={context.parameters.locale === 'ar' ? 'ar' : 'en'}>
        <div style={{ maxWidth: '1100px' }}>
          <Story />
        </div>
      </I18nProvider>
    ),
  ],
} satisfies Meta<typeof TableDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Populated: Story = { args: { rows: transactions.slice(0, 12) } };
export const LongText: Story = { args: { rows: longTextTransactions.slice(0, 5) } };

export const Loading: Story = {
  args: { rows: [] },
  render: () => <LoadingSkeleton />,
};

export const Error: Story = {
  args: { rows: [] },
  render: () => <ErrorState onRetry={() => alert('retry')} />,
};

export const EmptyNoData: Story = {
  args: { rows: [] },
  render: () => <EmptyState variant="no-data" />,
};

export const EmptyFiltered: Story = {
  args: { rows: [] },
  render: () => <EmptyState variant="no-results" onClearFilters={() => alert('clear')} />,
};

// RTL + Arabic chrome: layout mirrors via logical properties, figures stay
// Latin-digit and tabular so amounts scan the same in both directions.
export const RTLArabic: Story = {
  parameters: { locale: 'ar' },
  args: { rows: transactions.filter((tx) => tx.currency === 'AED' || tx.currency === 'SAR').slice(0, 8) },
  decorators: [
    (Story) => (
      <I18nProvider locale="ar">
        <div dir="rtl" lang="ar">
          <Story />
        </div>
      </I18nProvider>
    ),
  ],
};

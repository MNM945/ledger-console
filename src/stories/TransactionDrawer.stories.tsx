import { useEffect, useRef, useState, type ReactElement } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { I18nProvider } from '../i18n';
import { transactions, type Transaction } from '../data/transactions';
import { TransactionDrawer } from '../components/TransactionDrawer';

function DrawerDemo({ transaction }: { transaction: Transaction }) {
  const ref = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  return <>
    <button className="btn" type="button" onClick={(event) => { ref.current = event.currentTarget; setOpen(true); }}>Open transaction details</button>
    {open && <TransactionDrawer transaction={transaction} onClose={() => setOpen(false)} returnFocusRef={ref} />}
  </>;
}

// The drawer portals to <body>, so RTL must be set on the document root
// rather than on a wrapping div.
function RtlRootDecorator(Story: () => ReactElement) {
  useEffect(() => {
    const html = document.documentElement;
    const prev = { dir: html.dir, lang: html.lang };
    html.dir = 'rtl';
    html.lang = 'ar';
    return () => {
      html.dir = prev.dir;
      html.lang = prev.lang;
    };
  }, []);
  return (
    <I18nProvider locale="ar">
      <Story />
    </I18nProvider>
  );
}

const meta = {
  title: 'Components/TransactionDrawer',
  component: DrawerDemo,
  decorators: [
    (Story, context) => (
      <I18nProvider locale={context.parameters.locale === 'ar' ? 'ar' : 'en'}>
        <Story />
      </I18nProvider>
    ),
  ],
} satisfies Meta<typeof DrawerDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Settled: Story = {
  args: { transaction: transactions.find((tx) => tx.status === 'settled')! },
};

export const Failed: Story = {
  args: { transaction: transactions.find((tx) => tx.status === 'failed')! },
};

export const Refunded: Story = {
  args: { transaction: transactions.find((tx) => tx.status === 'refunded')! },
};

export const RTLArabic: Story = {
  parameters: { locale: 'ar' },
  args: { transaction: transactions.find((tx) => tx.currency === 'AED')! },
  decorators: [RtlRootDecorator],
};

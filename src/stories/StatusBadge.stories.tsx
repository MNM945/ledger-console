import type { Meta, StoryObj } from '@storybook/react-vite';
import { I18nProvider } from '../i18n';
import { StatusBadge } from '../components/StatusBadge';
import { ALL_STATUSES } from '../data/transactions';

const meta = {
  title: 'Components/StatusBadge',
  component: StatusBadge,
  decorators: [
    (Story) => (
      <I18nProvider locale="en">
        <Story />
      </I18nProvider>
    ),
  ],
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Settled: Story = { args: { status: 'settled' } };
export const Processing: Story = { args: { status: 'processing' } };
export const Failed: Story = { args: { status: 'failed' } };
export const Refunded: Story = { args: { status: 'refunded' } };
export const Pending: Story = { args: { status: 'pending' } };

// The state matrix at a glance: glyph + label + AA fg/bg token pair per status.
export const AllStatuses: Story = {
  args: { status: 'settled' },
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
      {ALL_STATUSES.map((status) => (
        <StatusBadge key={status} status={status} />
      ))}
    </div>
  ),
};

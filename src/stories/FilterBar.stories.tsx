import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { I18nProvider } from '../i18n';
import { FilterBar, type FilterState } from '../components/FilterBar';

function FilterDemo(props: { initial?: FilterState }) {
  const [value, setValue] = useState<FilterState>(
    props.initial ?? { statuses: [], currency: 'all', query: '' },
  );
  return <FilterBar value={value} onChange={setValue} />;
}

const meta = {
  title: 'Components/FilterBar',
  component: FilterDemo,
  decorators: [
    (Story) => (
      <I18nProvider locale="en">
        <Story />
      </I18nProvider>
    ),
  ],
} satisfies Meta<typeof FilterDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Active: Story = {
  args: { initial: { statuses: ['failed', 'pending'], currency: 'HKD', query: 'delta' } },
};

export const RTLArabic: Story = {
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

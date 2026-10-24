import type { Meta, StoryObj } from '@storybook/react-vite';
import { I18nProvider } from '../i18n';
import { MoneyText } from '../components/MoneyText';

const meta = {
  title: 'Components/MoneyText',
  component: MoneyText,
  decorators: [
    (Story, context) => (
      <I18nProvider locale={context.parameters.locale === 'ar' ? 'ar' : 'en'}>
        <Story />
      </I18nProvider>
    ),
  ],
  args: { amount: 1284.5, currency: 'GBP' },
} satisfies Meta<typeof MoneyText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GBP: Story = {};

export const USD: Story = { args: { amount: 9420.75, currency: 'USD' } };

export const EUR: Story = { args: { amount: 312.99, currency: 'EUR' } };

export const HKD: Story = { args: { amount: 58210, currency: 'HKD' } };

export const AED: Story = { args: { amount: 2304.2, currency: 'AED' } };

export const SAR: Story = { args: { amount: 871.4, currency: 'SAR' } };
export const Zero: Story = { args: { amount: 0, currency: 'HKD' } };
export const Negative: Story = { args: { amount: -12.4, currency: 'USD' } };
export const InvalidAmount: Story = { args: { amount: Number.NaN } };
export const InvalidCurrency: Story = { args: { currency: '$' } };
export const ZeroDecimalCurrency: Story = { args: { amount: 1200, currency: 'JPY' } };
export const ThreeDecimalCurrency: Story = { args: { amount: 12.345, currency: 'KWD' } };

export const WithFeeBreakdown: Story = {
  args: { amount: 1284.5, fee: 14.9, showBreakdown: true },
};

export const ArabicLocale: Story = {
  parameters: { locale: 'ar' },
  args: { amount: 2304.2, fee: 18.75, currency: 'AED', showBreakdown: true },
  decorators: [
    (Story) => (
      <div dir="rtl">
        <Story />
      </div>
    ),
  ],
};

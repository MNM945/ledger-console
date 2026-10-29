import type { Meta, StoryObj } from '@storybook/react-vite';
import {useEffect, useId, useState} from 'react';
import { I18nProvider } from '../i18n';
import { MoneyText } from '../components/MoneyText';
import { Input, Select } from '../components/Controls';

function CompactMoneyExample() {
  const id = useId();
  const [locale, setLocale] = useState<'en' | 'zh'>('en');
  const [amount, setAmount] = useState('1284.50');
  const [currency, setCurrency] = useState('GBP');
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      const sameOrigin = event.origin === location.origin || (location.protocol === 'file:' && event.origin === 'null');
      if (event.source !== window.parent || !sameOrigin || event.data?.type !== 'ledger-example-language' || !['en','zh'].includes(event.data.locale)) return;
      setLocale(event.data.locale);
    };
    window.addEventListener('message', receive);
    if (window.parent !== window) window.parent.postMessage({type:'ledger-example-ready'}, location.protocol === 'file:' ? '*' : location.origin);
    return () => window.removeEventListener('message', receive);
  }, []);
  return <I18nProvider locale={locale}><section aria-label="MoneyText" style={{maxWidth:420,display:'grid',gap:20,padding:8}}>
    <div style={{display:'grid',gap:8}}>
      <span className="field__label">MoneyText</span>
      <p style={{margin:0,fontSize:12,lineHeight:1.6,color:'var(--lc-color-text-secondary)'}}>{locale === 'zh' ? '展示 ISO 币种代码与本地格式；无效金额提供占位，并隔离双向文本。' : 'Displays ISO currency codes and local formats. Invalid amounts show a fallback, with bidirectional text isolation.'}</p>
      <strong style={{fontSize:24,lineHeight:1.3}} aria-live="polite"><MoneyText amount={amount.trim() ? Number(amount) : Number.NaN} currency={currency}/></strong>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,120px),1fr))',gap:12}}>
      <label className="field" htmlFor={`${id}-amount`}><span className="field__label">{locale === 'zh' ? '金额' : 'Amount'}</span><Input id={`${id}-amount`} type="number" inputMode="decimal" value={amount} onChange={event=>setAmount(event.target.value)}/></label>
      <label className="field"><span className="field__label">{locale === 'zh' ? '币种' : 'Currency'}</span><Select aria-label={locale === 'zh' ? '币种' : 'Currency'} value={currency} onValueChange={setCurrency}>{['GBP','USD','EUR','HKD','AED','SAR'].map(code=><option key={code}>{code}</option>)}</Select></label>
    </div>
  </section></I18nProvider>;
}

const meta = {
  title: 'Components/MoneyText',
  component: MoneyText,
  tags: ['autodocs'],
  argTypes: {
    amount: {control:'number',description:'Display amount; currency minor-unit rounding is applied.'},
    fee: {control:'number',description:'Optional fee in the same currency.'},
    currency: {control:'select',options:['GBP','USD','EUR','HKD','AED','SAR','JPY','KWD']},
    showBreakdown: {control:'boolean',description:'Show principal + fee = total when a fee is supplied.'},
  },
  parameters: {docs:{description:{component:'Reusable money component: explicit ISO code, integer minor-unit totals, invalid-value fallback and bidirectional isolation. Change the controls below; these are display fixtures, not payment instructions.'}}},
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

export const Interactive: Story = { render: () => <CompactMoneyExample /> };

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

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState, ErrorState, LoadingSkeleton } from '../components/StateViews';
import { I18nProvider, useI18n } from '../i18n';
import { Button } from '../components/Controls';

type State = 'loading' | 'no-data' | 'no-results' | 'network' | 'forbidden' | 'expired';
function StateDemo({ state }: { state: State }) {
  const { locale } = useI18n();
  const [recovered, setRecovered] = useState(false);
  if (recovered) return <div role="status"><p>{locale === 'ar' ? 'اكتملت الاستعادة المحلية. لم تتغير أي خدمة أو حساب.' : 'Local recovery completed. No service or account was changed.'}</p><Button onClick={() => setRecovered(false)}>{locale === 'ar' ? 'عرض الحالة مجددًا' : 'Show state again'}</Button></div>;
  if (state === 'loading') return <LoadingSkeleton />;
  if (state === 'no-data' || state === 'no-results') return <EmptyState variant={state} onClearFilters={() => setRecovered(true)} />;
  return <ErrorState kind={state} onRetry={() => setRecovered(true)} />;
}
const meta = {
  title: 'Patterns/Boundary states',
  component: StateDemo,
  decorators: [(Story, context) => <I18nProvider locale={context.parameters.locale === 'ar' ? 'ar' : 'en'}><div dir={context.parameters.locale === 'ar' ? 'rtl' : 'ltr'} lang={context.parameters.locale === 'ar' ? 'ar' : 'en'}><Story /></div></I18nProvider>],
  parameters: { docs: { description: { component: 'Distinct recovery contracts: loading exposes aria-busy; empty data offers guidance; filtered empty clears filters; blocked states expose no transaction rows. Recovery is local simulation only. Switch the toolbar to inspect both themes.' } } },
} satisfies Meta<typeof StateDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Loading: Story = { args: { state: 'loading' } };
export const NoData: Story = { args: { state: 'no-data' } };
export const NoResults: Story = { args: { state: 'no-results' } };
export const NetworkError: Story = { args: { state: 'network' } };
export const PermissionDenied: Story = { args: { state: 'forbidden' } };
export const SessionExpired: Story = { args: { state: 'expired' } };
export const PermissionDeniedArabic: Story = { args: { state: 'forbidden' }, parameters: { locale: 'ar' } };

import type { ReactNode } from 'react';
import {Button} from '../components/Controls';
import {useThemeTokens, type Token} from '../examples/theme-tokens';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontFamily: 'var(--lc-font-family-base)' }}>{title}</h2>
      {children}
    </section>
  );
}

function ColorSwatches({ rows }: { rows: Token[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(128px, 1fr))', gap: '0.75rem' }}>
      {rows.map((t) => {
        return (
          <div key={t.path} data-story-token={t.path} style={{ border: '1px solid var(--lc-color-border-default)', borderRadius: '0.5rem', overflow: 'hidden' }}>
            <div style={{ height: '2rem', background: `var(${t.variable})` }} />
            <div style={{ padding: '0.5rem', fontSize: '0.75rem', overflowWrap:'anywhere', fontFamily: 'var(--lc-font-family-mono)' }}>
              <div>{t.path}</div>
              <div data-story-token-value style={{ color: 'var(--lc-color-text-secondary)' }}>{t.value}</div>
              <div style={{ color: 'var(--lc-color-text-secondary)' }}>var({t.variable})</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TokenTable({ rows }: { rows: Token[] }) {
  return (
    <table style={{ borderCollapse: 'collapse', fontSize: '0.875rem', fontFamily: 'var(--lc-font-family-base)' }}>
      <thead>
        <tr>
          {['Token', 'Value', 'CSS variable'].map((h) => (
            <th key={h} style={{ textAlign: 'start', padding: '0.4rem 0.75rem', borderBottom: '2px solid var(--lc-color-border-default)' }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((t) => (
          <tr key={t.path}>
            <td style={{ padding: '0.4rem 0.75rem', borderBottom: '1px solid var(--lc-color-border-default)', fontFamily: 'var(--lc-font-family-mono)' }}>
              {t.path}
            </td>
            <td style={{ padding: '0.4rem 0.75rem', borderBottom: '1px solid var(--lc-color-border-default)' }}>
              {t.value}
            </td>
            <td style={{ padding: '0.4rem 0.75rem', borderBottom: '1px solid var(--lc-color-border-default)', fontFamily: 'var(--lc-font-family-mono)' }}>
              var({t.variable})
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function TokensPage() {
  const flat = useThemeTokens();
  const rows = (prefix: string) => flat.filter(token => token.path.startsWith(prefix));
  const theme = typeof document !== 'undefined' && document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
  return (
    <div style={{ fontFamily: 'var(--lc-font-family-base)', color: 'var(--lc-color-text-primary)', background:'var(--lc-color-surface-page)', padding:16, borderRadius:'var(--lc-radius-lg)' }}>
      <p>
        Effective theme values from the same CSS variables used by the ledger. The legacy primitive palette is hidden.
      </p>
      <Button onClick={() => {document.documentElement.dataset.theme = theme === 'light' ? 'dark' : 'light';}} aria-label="Switch token theme" aria-pressed={theme === 'dark'}>{theme === 'light' ? 'Dark theme' : 'Light theme'}</Button>
      {(['interactive','text','surface','border','focus','feedback','status','select'] as const).map(group => <Section key={group} title={`${group[0].toUpperCase()}${group.slice(1)} colors`}><ColorSwatches rows={rows(`color.${group}.`)}/></Section>)}
      <Section title="Font families"><TokenTable rows={rows('font.family.')}/></Section>
      <Section title="Type scale">
        <TokenTable rows={rows('font.size.')} />
      </Section>
      <Section title="Font weight">
        <TokenTable rows={rows('font.weight.')} />
      </Section>
      <Section title="Spacing">
        <TokenTable rows={rows('space.')} />
      </Section>
      <Section title="Radius">
        <TokenTable rows={rows('radius.')} />
      </Section>
      <Section title="Motion">
        <TokenTable rows={rows('duration.')} />
        <TokenTable rows={rows('easing.')} />
      </Section>
      <Section title="Z-index">
        <TokenTable rows={rows('z-index.')} />
      </Section>
    </div>
  );
}

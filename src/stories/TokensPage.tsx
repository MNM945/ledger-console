import type { ReactNode } from 'react';
import rawTokens from '../../tokens/tokens.json';

type TokenNode = { [key: string]: TokenNode | { $value: string } | string };

interface FlatToken {
  path: string;
  value: string;
}

function flatten(node: TokenNode, path: string[] = []): FlatToken[] {
  const out: FlatToken[] = [];
  for (const [key, val] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    if (val && typeof val === 'object' && '$value' in val) {
      out.push({ path: [...path, key].join('.'), value: String((val as { $value: string }).$value) });
    } else if (val && typeof val === 'object') {
      out.push(...flatten(val as TokenNode, [...path, key]));
    }
  }
  return out;
}

const flat = flatten(rawTokens as unknown as TokenNode);
const byPath = new Map(flat.map((t) => [t.path, t.value]));

function resolve(value: string): string {
  const m = value.match(/^\{(.+)\}$/);
  if (!m) return value;
  const next = byPath.get(m[1]);
  return next === undefined ? value : resolve(next);
}

const cssVar = (path: string) => `--lc-${path.replace(/\./g, '-')}`;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontFamily: 'var(--lc-font-family-base)' }}>{title}</h2>
      {children}
    </section>
  );
}

function ColorSwatches({ prefix }: { prefix: string }) {
  const rows = flat.filter((t) => t.path.startsWith(prefix));
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
      {rows.map((t) => {
        const resolved = resolve(t.value);
        return (
          <div key={t.path} style={{ border: '1px solid var(--lc-color-border-default)', borderRadius: '0.5rem', overflow: 'hidden' }}>
            <div style={{ height: '3rem', background: resolved }} />
            <div style={{ padding: '0.5rem', fontSize: '0.75rem', fontFamily: 'var(--lc-font-family-mono)' }}>
              <div>{t.path}</div>
              <div style={{ color: 'var(--lc-color-text-secondary)' }}>{resolved}</div>
              <div style={{ color: 'var(--lc-color-text-secondary)' }}>var({cssVar(t.path)})</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TokenTable({ prefix }: { prefix: string }) {
  const rows = flat.filter((t) => t.path.startsWith(prefix));
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
              {resolve(t.value)}
            </td>
            <td style={{ padding: '0.4rem 0.75rem', borderBottom: '1px solid var(--lc-color-border-default)', fontFamily: 'var(--lc-font-family-mono)' }}>
              var({cssVar(t.path)})
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function TokensPage() {
  return (
    <div style={{ fontFamily: 'var(--lc-font-family-base)', color: 'var(--lc-color-text-primary)' }}>
      <p>
        Rendered directly from <code>tokens/tokens.json</code> — the same source that generates{' '}
        <code>src/styles/tokens.css</code> and <code>src/tokens.ts</code> via <code>scripts/build-tokens.mjs</code>.
        See <code>docs/figma-variables-mapping.md</code> for the Figma Variables naming contract.
      </p>
      <Section title="Status colors (semantic)">
        <ColorSwatches prefix="color.status." />
      </Section>
      <Section title="Palette (primitive)">
        <ColorSwatches prefix="color.palette." />
      </Section>
      <Section title="Type scale">
        <TokenTable prefix="font.size." />
      </Section>
      <Section title="Font weight">
        <TokenTable prefix="font.weight." />
      </Section>
      <Section title="Spacing">
        <TokenTable prefix="space." />
      </Section>
      <Section title="Radius">
        <TokenTable prefix="radius." />
      </Section>
      <Section title="Motion">
        <TokenTable prefix="duration." />
        <TokenTable prefix="easing." />
      </Section>
      <Section title="Z-index">
        <TokenTable prefix="z-index." />
      </Section>
    </div>
  );
}

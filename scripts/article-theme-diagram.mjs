import {readFile} from 'node:fs/promises';

const escape = value => String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const label = (en, zh, tag='span', attrs='') => `<${tag} data-lc-en="${escape(en)}" data-lc-zh="${escape(zh)}" ${attrs}>${escape(en)}</${tag}>`;
const icon = body => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
const documentIcon = icon('<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>');
const componentsIcon = icon('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>');
const arrow = '<span class="lc-theme-arrow" aria-hidden="true">→</span>';

export async function buildThemeDiagram() {
  const source = JSON.parse(await readFile(new URL('../tokens/tokens.json',import.meta.url),'utf8'));
  const themeCss = await readFile(new URL('../src/styles/themes.css',import.meta.url),'utf8');
  const lightCss = themeCss.match(/:root\[data-theme='light'\]\s*\{([\s\S]*?)\}/)?.[1];
  if (!lightCss) throw new Error('The light theme must exist before building its diagram.');
  const value = (path, light) => {
    const base = path.split('.').reduce((node,key)=>node[key],source).$value;
    if (!light) return base;
    const cssName = `--lc-${path.replaceAll('.','-')}`;
    return lightCss.match(new RegExp(`${cssName}:\\s*([^;]+);`))?.[1].trim() || base;
  };
  const mode = (light) => {
    const styles = [['page','color.surface.page'],['surface','color.surface.raised'],['ink','color.text.primary'],['muted','color.text.secondary'],['action','color.interactive.primary'],['on-action','color.interactive.on-primary']].map(([name,path])=>`--mt-${name}:${value(path,light)}`).join(';');
    return `<div class="lc-theme-mode" title="${light?'themes.css':'tokens.css'}">
      <div class="lc-theme-mini" style="${escape(styles)}" aria-hidden="true"><div class="lc-theme-mini-bar"><i></i><span></span></div><div class="lc-theme-mini-card"><strong>Aa 123</strong><span></span><span></span><i>↗</i></div></div>
      ${label(light?'Light':'Dark',light?'浅色':'深色','h4')}
      ${label(light?'CSS overrides':'CSS variables',light?'CSS 覆盖':'CSS 变量','small','class="lc-theme-stack"')}
    </div>`;
  };
  return `<figure class="lc-article-viz lc-theme-diagram" data-ledger-visual="themes" aria-labelledby="lc-theme-title">
    <header class="lc-theme-heading">${label('Light & dark','深浅主题','h3','id="lc-theme-title"')}</header>
    <div class="lc-theme-flow">
      <div class="lc-theme-node" title="tokens.json → build-tokens.mjs → tokens.css + tokens.ts">${documentIcon}${label('Tokens','令牌','strong')}<small class="lc-theme-stack">JSON · Node.js</small></div>${arrow}
      <div class="lc-theme-modes">${mode(false)}${mode(true)}</div>${arrow}
      <div class="lc-theme-node" title="src/components/ · tokens.css + themes.css">${componentsIcon}${label('React components','React 组件','strong')}<small class="lc-theme-stack">React · TypeScript</small></div>
    </div>
  </figure>`;
}

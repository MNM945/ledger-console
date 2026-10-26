import {readFile} from 'node:fs/promises';

const escape = value => String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const label = (en, zh, tag='span', attrs='') => `<${tag} data-lc-en="${escape(en)}" data-lc-zh="${escape(zh)}" ${attrs}>${escape(en)}</${tag}>`;
const icon = body => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
const documentIcon = icon('<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>');
const buildIcon = icon('<path d="m9 5-7 7 7 7m6-14 7 7-7 7m-2-16-2 20"/>');
const componentsIcon = icon('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>');
const figmaIcon = icon('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h4M9 8v9"/>');
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
    return `<div class="lc-theme-mode">
      <div class="lc-theme-mini" style="${escape(styles)}" aria-hidden="true"><div class="lc-theme-mini-bar"><i></i><span></span><b></b></div><div class="lc-theme-mini-card"><strong>Aa 123</strong><span></span><span></span><i>↗</i></div></div>
      ${label(light?'Light':'Dark',light?'浅色':'深色','h4')}
      <code>${light?'themes.css':'tokens.css'}</code>
      ${label(light?'CSS overrides':'Generated base',light?'CSS 覆盖值':'生成的基础值','small')}
    </div>`;
  };
  return `<figure class="lc-article-viz lc-theme-diagram" data-ledger-visual="themes" aria-labelledby="lc-theme-title">
    <header class="lc-theme-heading">${label('Themes & Figma','主题与 Figma','h3','id="lc-theme-title"')}<div class="lc-theme-key"><span><i></i>${label('Build','生成')}</span><span><i class="lc-theme-key-dashed"></i>${label('Reference only','仅作参考')}</span></div></header>
    <div class="lc-theme-pipeline">
      <div class="lc-theme-node">${documentIcon}${label('Token source','令牌源','strong')}<code>tokens.json</code></div>${arrow}
      <div class="lc-theme-node">${buildIcon}${label('Build','生成','strong')}<code>build-tokens.mjs</code></div>${arrow}
      <div class="lc-theme-node">${componentsIcon}<strong>CSS + TypeScript</strong><code>tokens.css · tokens.ts</code></div>
    </div>
    <div class="lc-theme-branch" aria-hidden="true"></div>
    <div class="lc-theme-modes">${mode(false)}${mode(true)}</div>
    <div class="lc-theme-merge" aria-hidden="true"></div>
    <div class="lc-theme-node lc-theme-shared">${componentsIcon}${label('Shared React components','共享 React 组件','strong')}<div class="lc-theme-component-shapes" aria-hidden="true"><i></i><i></i><i></i></div></div>
    <div class="lc-theme-reference">${label('Documented mapping','文档映射')}</div>
    <div class="lc-theme-node lc-theme-figma">${figmaIcon}<strong>Figma</strong><code>COMPONENT_GUIDE.md</code></div>
  </figure>`;
}

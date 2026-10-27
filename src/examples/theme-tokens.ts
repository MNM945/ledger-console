import {useEffect, useState} from 'react';
import rawTokens from '../../tokens/tokens.json';

export type Token = {path: string; value: string; variable: string};
export const tokenVariable = (path: string) => `--lc-${path.replace(/\./g, '-')}`;
function flatten(node: object, prefix = ''): Token[] {
  return Object.entries(node).flatMap(([key, value]) => {
    if (key.startsWith('$') || !value || typeof value !== 'object') return [];
    const path = prefix ? `${prefix}.${key}` : key;
    return '$value' in value ? [{path, value:String(value.$value), variable:tokenVariable(path)}] : flatten(value, path);
  });
}
export const baseTokens = flatten(rawTokens);

function extraPath(variable: string) {
  const name = variable.slice('--lc-'.length);
  if (name.startsWith('color-')) {
    const [group, ...parts] = name.slice(6).split('-');
    return `color.${group}.${parts.join('-')}`;
  }
  return name.replace('-', '.');
}

/** Read the same effective CSS variables used by the ledger, including theme additions. */
export function readThemeTokens(): Token[] {
  const registry = new Map(baseTokens.filter(token => !token.path.startsWith('color.palette.')).map(token => [token.variable, token]));
  function collect(rules: CSSRuleList) {
    for (const rule of Array.from(rules)) {
      if ('selectorText' in rule && 'style' in rule) {
        const styleRule = rule as CSSStyleRule;
        if (!styleRule.selectorText.includes(':root')) continue;
        for (const name of Array.from(styleRule.style)) {
          if (!name.startsWith('--lc-') || name.startsWith('--lc-color-palette-') || registry.has(name)) continue;
          registry.set(name, {path:extraPath(name), value:'', variable:name});
        }
      } else if ('cssRules' in rule) collect((rule as CSSGroupingRule).cssRules);
    }
  }
  for (const sheet of Array.from(document.styleSheets)) {
    try { collect(sheet.cssRules); } catch { /* Cross-origin sheets cannot own this local token namespace. */ }
  }
  const style = getComputedStyle(document.documentElement);
  return Array.from(registry.values()).map(token => {
    const value = style.getPropertyValue(token.variable).trim();
    return {...token, value:value.startsWith('#') ? value.toUpperCase() : value};
  }).filter(token => token.value);
}

export function useThemeTokens() {
  const [tokens, setTokens] = useState<Token[]>([]);
  useEffect(() => {
    const refresh = () => setTokens(readThemeTokens());
    const observer = new MutationObserver(refresh);
    observer.observe(document.documentElement, {attributes:true, attributeFilter:['data-theme']});
    refresh();
    return () => observer.disconnect();
  }, []);
  return tokens;
}

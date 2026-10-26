import {useState, useRef, type ReactNode} from 'react';
import rawTokens from '../../tokens/tokens.json';
import {useI18n, type Locale} from '../i18n';
import {Button, Input, Select} from '../components/Controls';
import {MoneyText} from '../components/MoneyText';
import {StatusBadge} from '../components/StatusBadge';
import {FilterBar, type FilterState} from '../components/FilterBar';
import {TransactionTable, type SortState} from '../components/TransactionTable';
import {TransactionDrawer} from '../components/TransactionDrawer';
import {ThemeToggle, type Theme} from '../components/ThemeToggle';
import {LanguageSwitch} from '../components/DirectionToggle';
import {LoadingSkeleton, EmptyState, ErrorState} from '../components/StateViews';
import {ALL_STATUSES, transactions, type Transaction} from '../data/transactions';
import {compareMoney} from '../money';
import './design-system.css';

type Token = {path: string; value: string};
function flatten(node: object, prefix = ''): Token[] {
  return Object.entries(node).flatMap(([key, value]) => {
    if (key.startsWith('$') || !value || typeof value !== 'object') return [];
    const path = prefix ? `${prefix}.${key}` : key;
    return '$value' in value ? [{path, value: String(value.$value)}] : flatten(value, path);
  });
}
export const systemTokens = flatten(rawTokens);
const tokens = (prefix: string) => systemTokens.filter(token => token.path.startsWith(prefix));
const variable = (path: string) => `--lc-${path.replace(/\./g, '-')}`;
const pixels = (value: string) => value.endsWith('rem') ? `${parseFloat(value) * 16}px` : value;
const componentNames = ['Button','Input','Select','MoneyText','StatusBadge','FilterBar','TransactionTable','TransactionDrawer','ThemeToggle','LanguageSwitch','LoadingSkeleton','EmptyState','ErrorState'];
export const systemComponents = componentNames;
const emptyFilters: FilterState = {query:'', currency:'all', statuses:[]};

function Section({id, title, count, children}: {id: string; title: string; count?: number; children: ReactNode}) {
  return <section id={`ds-${id}`} className="ledger-ds-section" tabIndex={-1}><div className="ledger-ds-section-title"><h2>{title}</h2>{count !== undefined && <span>{count}</span>}</div>{children}</section>;
}
function Component({name, children, wide = false}: {name: string; children: ReactNode; wide?: boolean}) {
  return <article className={`ledger-ds-component${wide?' ledger-ds-component--wide':''}`} data-design-component={name}><h3>{name}</h3><div className="ledger-ds-component-body">{children}</div></article>;
}

export function DesignSystem({theme, onThemeToggle, onLocaleChange}: {theme: Theme; onThemeToggle: () => void; onLocaleChange: (locale: Locale) => void}) {
  const {locale, t} = useI18n();
  const c = (en: string, zh: string) => locale === 'zh' ? zh : en;
  const [feedback, setFeedback] = useState('');
  const [replay, setReplay] = useState(false);
  const [actions, setActions] = useState(0);
  const [reference, setReference] = useState('');
  const [attempted, setAttempted] = useState(false);
  const [currency, setCurrency] = useState('GBP');
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [sort, setSort] = useState<SortState>({key:'createdAt',direction:'desc'});
  const [selection, setSelection] = useState<Transaction | null>(null);
  const [boundary, setBoundary] = useState('all');
  const trigger = useRef<HTMLElement | null>(null);
  const invalid = attempted && !reference.trim();
  const rows = transactions.filter(tx => (filters.currency === 'all' || tx.currency === filters.currency) && (!filters.statuses.length || filters.statuses.includes(tx.status)) && `${tx.counterparty} ${tx.reference}`.toLowerCase().includes(filters.query.toLowerCase())).slice(0,4);
  const sorted = [...rows].sort((a,b) => (sort.key === 'amount' ? compareMoney(a,b) : a[sort.key].localeCompare(b[sort.key])) * (sort.direction === 'asc' ? 1 : -1));
  async function copyToken(token: Token) {
    const declaration = `${variable(token.path)}: ${token.value};`;
    try {await navigator.clipboard.writeText(declaration); setFeedback(c('Token copied','已复制令牌'));}
    catch {setFeedback(declaration);}
  }
  const colorGroups = [
    ['color.interactive.','Action','交互'], ['color.text.','Text','文字'], ['color.surface.','Surface','表面'],
    ['color.border.','Border','边框'], ['color.focus.','Focus','焦点'], ['color.feedback.','Feedback','反馈'],
    ['color.status.','Status','状态'], ['color.palette.','Palette','基础色板'],
  ];
  return <div className="ledger-ds">
    <header className="ledger-ds-intro"><span>LEDGER CONSOLE</span><h2>{c('Foundations & components','基础规范与组件')}</h2><div className="ledger-ds-meta"><span>{systemTokens.length} {c('tokens','个令牌')}</span><span>{componentNames.length} {c('components','个组件')}</span><span>{c('Light / Dark','浅色 / 深色')}</span></div></header>
    <nav className="ledger-ds-nav" aria-label={c('Design system sections','设计系统目录')}>
      {[['colors','Color','颜色'],['type','Type','字体'],['space','Space','间距'],['radius','Radius','圆角'],['motion','Motion','动效'],['layers','Layers','层级'],['components','Components','组件']].map(([id,en,zh]) => <a key={id} href={`#ds-${id}`}>{c(en,zh)}</a>)}
    </nav>
    <div className="ledger-ds-content">
      <Section id="colors" title={c('Colors','颜色')} count={tokens('color.').length}>
        <p className="ledger-ds-note">{c('Base values · select a swatch to copy its token.','基础色值 · 点击色板复制令牌。')}</p>
        {colorGroups.map(([prefix,en,zh]) => <div className="ledger-ds-color-group" key={prefix}><h3>{c(en,zh)}</h3><div className="ledger-ds-swatches">{tokens(prefix).map(token => <button key={token.path} type="button" className="ledger-ds-swatch" data-design-token={token.path} title={`${variable(token.path)}: ${token.value}`} aria-label={`${c('Copy','复制')} ${token.path} ${token.value}`} onClick={() => copyToken(token)}><span className="ledger-ds-checker"><i style={{background:token.value}}/></span><span className="ledger-ds-swatch-name">{token.path.slice(prefix.length)}</span><code>{token.value}</code></button>)}</div></div>)}
        <p className="ledger-ds-feedback" role="status">{feedback}</p>
      </Section>
      <Section id="type" title={c('Typeface','字体')} count={tokens('font.').length}>
        <div className="ledger-ds-two">{tokens('font.family.').map(token => <div key={token.path} data-design-token={token.path} className="ledger-ds-font" style={{fontFamily:token.value}} title={token.value}><small>{token.path.replace('font.','')}</small><strong>{token.path.endsWith('mono')?'0123.45':'Aa Bb Cc'}</strong><span>{token.value.split(',').slice(0,2).join(',').replace(/'/g,'')}</span></div>)}</div>
        <div className="ledger-ds-type-scale">{tokens('font.size.').map(token => <div key={token.path} data-design-token={token.path}><code>{token.path.replace('font.size.','')} / {pixels(token.value)}</code><span style={{fontSize:token.value}}>{c('Aa 12','金额 12')}</span></div>)}</div>
        <div className="ledger-ds-weights">{tokens('font.weight.').map(token => <div key={token.path} data-design-token={token.path}><span style={{fontWeight:Number(token.value)}}>Aa 0123</span><small>{token.path.replace('font.weight.','')} · {token.value}</small></div>)}</div>
      </Section>
      <Section id="space" title={c('Spacing','间距')} count={tokens('space.').length}>
        <div className="ledger-ds-spacing">{tokens('space.').map(token => <div key={token.path} data-design-token={token.path}><code title={token.path}>{token.path.replace('space.','')}</code><span className="ledger-ds-space-track"><i style={{width:token.value}}/></span><small>{pixels(token.value)}</small></div>)}</div>
      </Section>
      <Section id="radius" title={c('Radius','圆角')} count={tokens('radius.').length}>
        <div className="ledger-ds-radii">{tokens('radius.').map(token => <div key={token.path} data-design-token={token.path}><i style={{borderRadius:token.value}}/><span>{token.path.replace('radius.','')}</span><code>{pixels(token.value)}</code></div>)}</div>
      </Section>
      <Section id="motion" title={c('Motion','动效')} count={tokens('duration.').length + tokens('easing.').length}>
        <Button onClick={() => setReplay(!replay)}>{c('Play','播放')} ↗</Button>
        <div className="ledger-ds-motion" data-replay={replay}>{tokens('duration.').map(token => <div key={token.path} data-design-token={token.path}><span>{token.path.replace('duration.','')}</span><div className="ledger-ds-motion-track"><i style={{transitionDuration:token.value}}/></div><code>{token.value}</code></div>)}</div>
        <div className="ledger-ds-easing">{tokens('easing.').map(token => {
          const values = token.value.match(/[\d.]+/g)!.map(Number);
          return <div key={token.path} data-design-token={token.path} title={token.value}><svg viewBox="0 0 120 100" role="img" aria-label={token.value}><path d="M10 10 V90 H110" fill="none" stroke="currentColor" opacity=".15"/><path d={`M10 90 C${10+values[0]*100} ${90-values[1]*80}, ${10+values[2]*100} ${90-values[3]*80},110 10`} fill="none" stroke="currentColor" strokeWidth="2"/><circle cx={replay?'110':'10'} cy={replay?'10':'90'} r="4" fill="currentColor"/></svg><b>{token.path.replace('easing.','')}</b><code>{token.value}</code></div>;
        })}</div>
      </Section>
      <Section id="layers" title={c('Layers','层级')} count={tokens('z-index.').length}>
        <div className="ledger-ds-layers">{tokens('z-index.').map((token,index) => <div key={token.path} data-design-token={token.path} style={{zIndex:Number(token.value),insetInlineStart:`${index*22}%`,top:index*14}}><span>{token.path.replace('z-index.','')}</span><code>{token.value}</code></div>)}</div>
      </Section>
      <Section id="components" title={c('Components','组件')} count={componentNames.length}>
        <div className="ledger-ds-component-grid">
          <Component name="Button" wide><div className="ledger-ds-button-row"><Button className="btn btn--primary" onClick={() => setActions(actions+1)}>{c('Confirm','确认')}</Button><Button onClick={() => setActions(actions+1)}>{c('Secondary','次要操作')}</Button><Button disabled>{c('Disabled','已禁用')}</Button></div><span role="status" className="ledger-ds-note">{actions ? `${c('Actions','操作次数')} · ${actions}` : c('Default / hover / focus / disabled','默认 / 悬停 / 聚焦 / 禁用')}</span></Component>
          <Component name="Input"><label className="field"><span className="field__label">{c('Reference','参考编号')}</span><Input value={reference} onChange={event => {setReference(event.target.value);setAttempted(false);}} placeholder="PAY-2026-10420" required aria-invalid={Boolean(invalid)} aria-describedby={invalid?'ds-reference-error':undefined}/></label>{invalid && <p className="field__error" id="ds-reference-error" role="alert">{c('Enter a reference.','请输入参考编号。')}</p>}<Button onClick={() => setAttempted(true)}>{c('Validate','校验')}</Button><Input aria-label={c('Disabled reference','已禁用参考编号')} value="PAY-2026-10420" disabled/></Component>
          <Component name="Select"><label className="field"><span className="field__label">{c('Currency','币种')}</span><Select value={currency} onValueChange={setCurrency}>{['GBP','USD','EUR','HKD','AED','SAR'].map(code => <option key={code}>{code}</option>)}</Select></label><Select aria-label={c('Disabled currency','已禁用币种')} disabled value="GBP"><option>GBP</option></Select></Component>
          <Component name="MoneyText"><div className="ledger-ds-money"><MoneyText amount={1284.5} currency={currency}/><MoneyText amount={0} currency={currency}/><MoneyText amount={-79.33} currency={currency}/><MoneyText amount={134.76} fee={2.15} currency={currency} showBreakdown/></div></Component>
          <Component name="StatusBadge"><div className="ledger-ds-statuses">{ALL_STATUSES.map(status => <StatusBadge status={status} key={status}/>)}</div></Component>
          <Component name="ThemeToggle"><ThemeToggle theme={theme} onToggle={onThemeToggle}/></Component>
          <Component name="LanguageSwitch"><LanguageSwitch locale={locale} onChange={onLocaleChange}/></Component>
          <Component name="FilterBar" wide><FilterBar value={filters} onChange={setFilters}/></Component>
          <Component name="TransactionTable" wide><div className="table-scroll" tabIndex={0} role="region" aria-label={c('Component transaction table','组件交易表格')}>{rows.length ? <TransactionTable transactions={sorted} sort={sort} onSortChange={setSort} onRowOpen={(tx,element) => {trigger.current=element;setSelection(tx);}}/> : <EmptyState variant="no-results" onClearFilters={() => setFilters(emptyFilters)}/>}</div></Component>
          <Component name="TransactionDrawer" wide><div className="ledger-ds-drawer-preview"><div><StatusBadge status="refunded"/><h4>{t.drawerTitle}</h4><MoneyText amount={transactions[14].amount} currency={transactions[14].currency}/></div><Button onClick={event => {trigger.current=event.currentTarget;setSelection(transactions[14]);}}>{c('Open drawer','打开抽屉')} ↗</Button></div></Component>
          <Component name="LoadingSkeleton" wide><LoadingSkeleton rows={2}/></Component>
          <Component name="EmptyState" wide><div className="ledger-ds-two"><EmptyState variant="no-data"/><EmptyState variant="no-results" onClearFilters={() => {setFilters(emptyFilters);setFeedback(c('Filters cleared','已清除筛选'));}}/></div></Component>
          <Component name="ErrorState" wide><div className="ledger-ds-button-row">{[['all','All','全部'],['network','Network','网络'],['forbidden','Permission','权限'],['expired','Session','会话']].map(([value,en,zh]) => <Button key={value} aria-pressed={boundary===value} onClick={() => setBoundary(value)}>{c(en,zh)}</Button>)}</div><div className="ledger-ds-error-grid">{(['network','forbidden','expired'] as const).filter(kind => boundary==='all' || boundary===kind).map(kind => <ErrorState kind={kind} key={kind} onRetry={() => {setBoundary('recovered');}}/>)}{boundary==='recovered' && <div className="ledger-ds-recovered" role="status"><StatusBadge status="settled"/><Button onClick={() => setBoundary('all')}>{c('Show states again','再次展示状态')}</Button></div>}</div></Component>
        </div>
      </Section>
    </div>
    {selection && <TransactionDrawer transaction={selection} returnFocusRef={trigger} onClose={() => setSelection(null)}/>}
  </div>;
}
